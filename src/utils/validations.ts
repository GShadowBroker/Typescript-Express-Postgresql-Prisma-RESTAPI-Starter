import { IUsersQueryModel, IFilterUsersModel, IFilterUserRole, ICreateUserModel, IUserLogin } from '../types';
import { HttpException, IncorrectQueryException, IncorrectTypeException } from './exceptions';

export const validateQueryUsers = (query: IUsersQueryModel): IFilterUsersModel => {
  const limit = Number(query.limit);
  const offset = Number(query.offset);
  const role: IFilterUserRole = query.role?.toString().toUpperCase() as IFilterUserRole;
  if (query.limit !== undefined && isNaN(limit)) {
    throw new IncorrectQueryException("limit", "number", query.limit);
  }
  if (query.offset !== undefined && isNaN(offset)) {
    throw new IncorrectQueryException("offset", "number", query.offset);
  }
  if (query.role !== undefined && !['USER', 'ADMIN', undefined].includes(role)) {
    throw new IncorrectQueryException("role", "USER | ADMIN", query.role);
  }
  const filters: IFilterUsersModel = {
    offset: Number(query.offset),
    limit: Number(query.limit),
    role: query.role?.toString().toUpperCase() as IFilterUserRole
  };
  return filters;
};

export const validateNewUser = (body: ICreateUserModel): ICreateUserModel => {
  // Validations here
  if (!body.username || !body.email || !body.password) {
    throw new HttpException(400, "The fields 'username', 'email' and 'password' are required");
  }
  return body;
};

export const validateCredentials = (body: IUserLogin): IUserLogin => {
  // Validations here
  if (!body.email || !body.password) {
    throw new HttpException(400, "The fields 'email' and 'password' are required");
  }
  return body;
};

export const validateParamsId = (params: { id: string | undefined; }): number => {
  const { id } = params as { id: string | undefined; };
  if (!id || isNaN(Number(id))) {
    throw new IncorrectTypeException("id", "number", id);
  }
  return Number(id);
};