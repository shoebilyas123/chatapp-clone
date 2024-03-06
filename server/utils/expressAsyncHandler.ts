import { IMiddleware } from '../types/index';
import { Query } from 'express-serve-static-core';

type IExpressAsyncHandler = <B, Q extends Query, R>(
  _: IMiddleware<B, Q, R>
) => IMiddleware<B, Q, R>;

function expressAsyncHandler(fn): IExpressAsyncHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
