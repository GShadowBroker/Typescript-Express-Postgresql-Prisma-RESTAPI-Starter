import express from 'express';
import config from '../../config';
import userService from '../../services/userService';
import { ICreateUserModel, IUserLogin } from "../../types";
import { HttpException } from '../../utils/exceptions';
import { validateNewUser, validateCredentials } from '../../utils/validations';

const router = express.Router();

// eslint-disable-next-line
router.post('/signup', async (req, res, next) => {
  try {
    const validatedUser = validateNewUser(req.body as ICreateUserModel);
    const user = await userService.createUser(validatedUser);
    return res.status(201).json({ ...user, password: undefined });
  } catch (error) {
    return next(error);
  }
});

// eslint-disable-next-line
router.post('/signin', async (req, res, next) => {
  try {
    const validatedCredentials = validateCredentials(req.body as IUserLogin);
    const token = await userService.login(validatedCredentials);
    if (!token) {
      throw new HttpException(500, "Failed creating auth token");
    }
    return res
      .cookie('ssid', token, { httpOnly: true, secure: config.env === 'production' })
      .status(200)
      .json({ message: 'Logged in successfully' });
  } catch (error) {
    return next(error);
  }
});

router.post('/signout', (req, res, next) => {
  try {
    if (!req.cookies['ssid']) {
      throw new HttpException(400, 'Invalid auth token');
    }
    return res
      .clearCookie('ssid')
      .status(200)
      .json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
});

export default router;