import express, { Request, Response } from "express";
import mysql, { OkPacketParams, Pool, ResultSetHeader } from "mysql2/promise";
import { randomBytes, scryptSync } from "crypto";
import cookieeParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import { FullUser } from "./types";
import { jwtSign } from "./helper/auth";
import { authMiddleware } from "./middleware/auth";
import { seedDb } from "./seed";

const PORT = process.env.PORT!;

const app = express();
app.use(cookieeParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_PASSWORD,
  port: 3306,
});

app.post(
  "/signup",
  async (
    req: Request<never, never, { password: string; email: string }>,
    res: Response
  ) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const { password, email } = req.body;

      const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
        password
      );

      if (req.cookies.jwt) {
        connection.destroy();
        return res.status(400).send("ALREADY_LOGGED_IN");
      }

      if (!validEmail || !validPassword) {
        connection.destroy();
        return res.status(400).send("INVALID_CREDENTIALS");
      }

      const [found] = await connection.query<FullUser[]>(
        "SELECT * FROM User where email = ?",
        [email]
      );

      if (found?.length || req.user) {
        console.log(found);
        connection.destroy();

        return res.status(400).send();
      }

      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, 32).toString("hex");

      const q = `
    INSERT INTO User (email, hashed, salt, createdDate) 
    VALUES (?,?,?,?)`;
      const values = [email, hash, salt, new Date()];

      const [{ insertId }] = await connection.execute<ResultSetHeader>(
        q,
        values
      );

      await connection.commit();
      connection.destroy();

      const jwt = await jwtSign(email, insertId.toString());

      res.setHeader("Set-Cookie", `jwt=${jwt}; HttpOnly`);

      return res.send({ email, id: insertId });
    } catch (e) {
      console.log(e);
      connection.destroy();
      return res.status(500).send();
    }
  }
);

app.post("/login", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const { password, email } = req.body;

    const [[found]] = await connection.execute<FullUser[]>(
      "SELECT * FROM User where email = ?",
      [email]
    );
    if (!found) {
      connection.destroy();
      return res.status(400).send();
    }

    const { salt, hashed } = found;
    const reqHash = scryptSync(password, salt, 32).toString("hex");

    if (hashed !== reqHash) {
      connection.destroy();
      return res.status(401).send();
    }

    await connection.commit();
    connection.destroy();

    const jwt = await jwtSign(found.email, found.id);
    res.setHeader("Set-Cookie", `jwt=${jwt}; HttpOnly`);

    return res.send({ email, id: found.id });
  } catch (e) {
    console.log(e);
    connection.destroy();
    return res.status(500).send();
  }
});

app.get("/secret", authMiddleware, async (req, res) => {
  try {
    return res.send("hello world");
  } catch (e) {
    return res.status(500).send();
  }
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).send();
  } catch (e) {
    return res.status(500).send();
  }
});

// start the Express server
app.listen(PORT, async () => {
  let connected = Boolean(await pool.getConnection().catch((_) => false));
  console.log(connected ? `Connected to mysql db` : `Failed to connect to db`);

  console.log(`server started at http://localhost:${PORT}`);

  await seedDb(pool);
});
