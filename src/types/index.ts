import { User } from '.prisma/client';
import { Request } from 'express';

export type IEnv = 'production' | 'development';

export interface IConfig {
  port: number;
  env: IEnv;
  tokenSecret: string;
  tokenExpiration: number;
  cookieSecretKey: string;
}

export interface IParamsId {
  id: string | undefined;
}

export type IUserSafe = Omit<User, "password">;

export interface IUserLogin {
  email: string | undefined;
  password: string | undefined;
}

export interface IRequestUser extends Request {
  user: User | undefined;
}

export interface ICreateUserModel {
  username: string;
  email: string;
  password: string;
}

export type IFilterUserRole = 'USER' | 'ADMIN' | undefined;

export interface IUsersQueryModel {
  limit: string | undefined;
  offset: string | undefined;
  role: string | undefined;
}

export interface IFilterUsersModel {
  limit: number | undefined;
  offset: number | undefined;
  role: IFilterUserRole;
}