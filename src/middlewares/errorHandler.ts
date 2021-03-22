import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/exceptions';

export default (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Something went horribly wrong";

  return res.status(status).json({ status, message });
};
