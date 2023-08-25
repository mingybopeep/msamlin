import { BaseUser } from "./types";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: BaseUser;
    }
  }
}
