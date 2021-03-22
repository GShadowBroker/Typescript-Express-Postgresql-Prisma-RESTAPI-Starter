import express from 'express';
import { PrismaClient } from '@prisma/client';
import config from './config';
import api from './api';
import middleware from './middlewares';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import setReqUser from './services/passport';
import cookieParser from 'cookie-parser';

export const prisma = new PrismaClient();
const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(cookieParser(config.cookieSecretKey));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
setReqUser(passport);

app.use('/api/v1', api.authRoute);
app.use('/api/v1/users', api.userRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.port, () => {
  console.log(`
    ################################################
    
    Server running on port ${config.port} in ${config.env} mode.

    ################################################
  `);
});
