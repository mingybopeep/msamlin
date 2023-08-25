import { jwtVerify } from "../helper/auth";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = jwtVerify(req.cookies.jwt);
    req.user = user;

    next();
  } catch (e) {
    console.log(res);
    return res.status(401).send("NOT_AUTHORIZED");
  }
};
