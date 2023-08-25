import jwt from "jsonwebtoken";
import { BaseUser } from "../types";

export const jwtSign = async (email: string, id: string): Promise<string> => {
  return await new Promise((res, rej) => {
    jwt.sign(
      {
        user: {
          id,
          email,
        },
      },
      process.env.JWT_SALT!,
      (err: any, token: string | undefined) => {
        if (err || !token) {
          rej(err || new Error("Error generating token"));
        }

        res(token!);
      }
    );
  });
};

export const jwtVerify = (token: string) =>
  jwt.verify(token, process.env.JWT_SALT!) as {
    user: BaseUser;
  };
