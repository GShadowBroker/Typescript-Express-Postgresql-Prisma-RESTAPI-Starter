import { UsersQueryModel, FilterUsersModel, FilterUserRole, CreateUserModel, UserLogin } from '../types';
import { HttpException, IncorrectQueryException } from './exceptions';

export const validateQueryUsers = (query: UsersQueryModel): FilterUsersModel => {
  const limit = Number(query.limit);
  const offset = Number(query.offset);
  const role: FilterUserRole = query.role?.toString().toUpperCase() as FilterUserRole;
  if (query.limit !== undefined && isNaN(limit)) {
    throw new IncorrectQueryException("limit", "number", query.limit);
  }
  if (query.offset !== undefined && isNaN(offset)) {
    throw new IncorrectQueryException("offset", "number", query.offset);
  }
  if (query.role !== undefined && !['USER', 'ADMIN', undefined].includes(role)) {
    throw new IncorrectQueryException("role", "USER | ADMIN", query.role);
  }
  const filters: FilterUsersModel = {
    offset: Number(query.offset),
    limit: Number(query.limit),
    role: query.role?.toString().toUpperCase() as FilterUserRole
  };
  return filters;
};

export const validateNewUser = (body: CreateUserModel): CreateUserModel => {
  // Validations here
  if (!body.username || !body.email || !body.password) {
    throw new HttpException(400, "The fields 'username', 'email' and 'password' are required");
  }
  return body;
};

export const validateCredentials = (body: UserLogin): UserLogin => {
  // Validations here
  if (!body.email || !body.password) {
    throw new HttpException(400, "The fields 'email' and 'password' are required");
  }
  return body;
};