import { User } from '.prisma/client';
import express from 'express';
import userService from '../../services/userService';
import { IFilterUsersModel, IUsersQueryModel, IUserSafe, IParamsId } from "../../types";
import { HttpException } from '../../utils/exceptions';
import { validateParamsId, validateQueryUsers } from '../../utils/validations';
import passport from 'passport';

const router = express.Router();

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res, _next) => {
  console.log(`user`, JSON.stringify(req.user, null, 2));
  return res.status(200).json({ user: req.user });
});

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const filters: IFilterUsersModel = validateQueryUsers(req.query as unknown as IUsersQueryModel);
    const users = await userService.getAll(filters);
    const allUsers: IUserSafe[] = users.map((user: User) => ({ ...user, password: undefined }));
    return res.status(200).json(allUsers);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const id = validateParamsId(req.params as unknown as IParamsId);
    const user = await userService.getUserById(id);
    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req: any, res, next) => {
  try {
    if (req.user.role !== 'ADMIN' && Number(req.user.id) !== Number(req.params.id)) {
      throw new HttpException(403, "Unauthorized action");
    }
    const id = validateParamsId(req.params as IParamsId);
    await userService.removeUser(id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;