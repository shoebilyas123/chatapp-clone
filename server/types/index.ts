import type { NextFunction, Request, Response } from 'express';
import { Query, Send } from 'express-serve-static-core';

export interface ITypedRequest<B, Q extends Query> extends Request {
  body: B;
  query: Q;
}

export interface ITypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export type IRequestHandler = <B, Q extends Query, IResB>(
  _req: ITypedRequest<B, Q>,
  _res: ITypedResponse<IResB>
) => Promise<any>;

export type IMiddleware<B, Q extends Query, IResB> = (
  _: ITypedRequest<B, Q>,
  _r: ITypedResponse<IResB>,
  __n: NextFunction
) => Promise<any>;

export interface IOpenChatReq {
  from: string;
  to: string;
}

export interface GlobalDocWrapper {
  id?: string;
}
