import { IRequestHandler, ParsedQs } from '../types/index';

export function expressAsyncHandler<
  P = {},
  Rq = {},
  Rs = {},
  Q extends ParsedQs = {}
>(fn: IRequestHandler<P, Rq, Rs, Q>): IRequestHandler<P, Rq, Rs, Q> {
  return (req, res, next) => fn(req, res, next).catch(next);
}
