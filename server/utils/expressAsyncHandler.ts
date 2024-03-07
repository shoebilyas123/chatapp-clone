import { IRequestHandler } from '../types/index';
import { Query } from 'express-serve-static-core';

export function expressAsyncHandler<
  P = {},
  Rq = {},
  Rs = {},
  Q extends Query = {}
>(fn: IRequestHandler<P, Rq, Rs, Q>): IRequestHandler<P, Rq, Rs, Q> {
  return (req, res, next) => fn(req, res, next).catch(next);
}
