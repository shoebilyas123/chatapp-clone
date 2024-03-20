import type { NextFunction, Request, Response } from 'express';
import { IUser } from './models/users';

export type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

export interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export interface ITypedRequest<ReqBody, Q extends ParsedQs> extends Request {
  body: ReqBody;
  query: Q;
  user: IUser;
}

export interface ITypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export type IRequestHandler<
  Params = {},
  ReqBody = {},
  ResBody = {},
  Q extends ParsedQs = {}
> = (
  _req: ITypedRequest<ReqBody, Q>,
  _res: ITypedResponse<ResBody>,
  _next: NextFunction
) => Promise<ResBody | void>;

export interface GlobalDocWrapper {
  id?: string;
}
