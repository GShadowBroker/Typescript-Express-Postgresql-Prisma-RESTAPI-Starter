import { User } from '.prisma/client';
import { prisma } from '../server';
import config from '../config';
import { PassportStatic } from 'passport';
import passportJwt from 'passport-jwt';
import { Request } from 'express';

const JwtStrategy = passportJwt.Strategy;

const cookieExtractor = (req: Request): string | null => {
  let jwt: string | null = null;
  if (req && req.cookies) {
    jwt = req.cookies['ssid'] as string | null;
  }
  return jwt;
};

export default (passport: PassportStatic): void => {
  const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.tokenSecret
  };
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    if (!jwt_payload.expiration || Date.now() > jwt_payload.expiration) {
      done('Invalid token', false);
    }
    prisma.user.findUnique({ where: { id: jwt_payload.id as number } })
      .then((user: User | null) => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(err => done(err, false));
  }));
};
