import { User } from '.prisma/client';
import express from 'express';
import userService from '../../services/userService';
import { FilterUsersModel, UsersQueryModel, UserSafe } from "../../types";
import { HttpException, IncorrectTypeException } from '../../utils/exceptions';
import { validateQueryUsers } from '../../utils/validations';
import passport from 'passport';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const filters: FilterUsersModel = validateQueryUsers(req.query as unknown as UsersQueryModel);
    const users = await userService.getAll(filters);
    const allUsers: UserSafe[] = users.map((user: User) => ({ ...user, password: undefined }));
    return res.status(200).json(allUsers);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params as { id: string | undefined; };
    if (!id || isNaN(Number(id))) {
      throw new IncorrectTypeException("id", "number", id);
    }
    const user = await userService.getUserById(Number(id));
    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req: any, res, next) => {
  if (req.user.role !== 'ADMIN' && Number(req.user.id) !== Number(req.params.id)) {
    throw new HttpException(403, "Action denied");
  }
  try {
    const { id } = req.params as { id: string | undefined; };
    if (!id || isNaN(Number(id))) {
      throw new IncorrectTypeException("id", "number", id);
    }
    await userService.removeUser(Number(id));
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;