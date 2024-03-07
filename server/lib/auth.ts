import jwt from 'jsonwebtoken';
import { envs } from '../server';

export const signToken = (id: string) => {
  return jwt.sign({ id }, envs.JWT_SECRET, {
    expiresIn: envs.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, envs.JWT_SECRET);
};
