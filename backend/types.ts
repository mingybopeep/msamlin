import { RowDataPacket } from "mysql2";
import { Request } from "express";

export interface BaseUser extends RowDataPacket {
  id: string;
  email: string;
}

export interface FullUser extends BaseUser {
  salt: string;
  hashed: string;
}
