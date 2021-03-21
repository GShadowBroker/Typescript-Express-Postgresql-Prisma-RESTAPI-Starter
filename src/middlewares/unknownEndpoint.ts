import { Request, Response, NextFunction } from 'express';

export default (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json({ status: 404, message: "Unknown endpoint" });
};