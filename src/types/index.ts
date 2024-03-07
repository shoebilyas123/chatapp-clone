import type { NextFunction, Request, Response } from 'express';
import { Query, Send } from 'express-serve-static-core';

export interface ITypedRequest<ReqBody, Q extends Query> extends Request {
  body: ReqBody;
  query: Q;
}

export interface ITypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export type IRequestHandler<
  Params = {},
  ReqBody = {},
  ResBody = {},
  Q extends Query = {}
> = (
  _req: ITypedRequest<ReqBody, Q>,
  _res: ITypedResponse<ResBody>,
  _next: NextFunction
) => Promise<ResBody | void>;

export interface IOpenChatReq {
  from: string;
  to: string;
}

export interface GlobalDocWrapper {
  id?: string;
}
