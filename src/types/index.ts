import { User } from '.prisma/client';
import { Request } from 'express';

export type UserSafe = Omit<User, "password">;

export interface UserLogin {
  email: string | undefined;
  password: string | undefined;
}

export interface RequestUser extends Request {
  user: User | undefined;
}

export interface CreateUserModel {
  username: string;
  email: string;
  password: string;
}

export type FilterUserRole = 'USER' | 'ADMIN' | undefined;

export interface UsersQueryModel {
  limit: string | undefined;
  offset: string | undefined;
  role: string | undefined;
}

export interface FilterUsersModel {
  limit: number | undefined;
  offset: number | undefined;
  role: FilterUserRole;
}