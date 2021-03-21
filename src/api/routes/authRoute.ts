import express from 'express';
import userService from '../../services/userService';
import { CreateUserModel, UserLogin } from "../../types";
import { HttpException } from '../../utils/exceptions';
import { validateNewUser, validateCredentials } from '../../utils/validations';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const validatedUser = validateNewUser(req.body as CreateUserModel);
    const user = await userService.createUser(validatedUser);
    return res.status(201).json({ ...user, password: undefined });
  } catch (error) {
    return next(error);
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    const validatedCredentials = validateCredentials(req.body as UserLogin);
    const token = await userService.login(validatedCredentials);
    if (!token) {
      throw new HttpException(500, "Failed creating auth token");
    }
    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
});

export default router;