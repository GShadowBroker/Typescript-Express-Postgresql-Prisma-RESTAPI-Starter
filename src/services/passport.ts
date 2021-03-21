import { User } from '.prisma/client';
import { prisma } from '../server';
import _passport from 'passport-jwt';
import config from '../config';
import { PassportStatic } from 'passport';

const JwtStrategy = _passport.Strategy;
const ExtractJwt = _passport.ExtractJwt;

export default (passport: PassportStatic): void => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.tokenSecret
  };
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
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
