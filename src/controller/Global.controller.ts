// Global Imports
import path from 'path';

// Local Imports
import { IRequestHandler, ITypedRequest, ITypedResponse } from '../types';
import AppError from '../lib/appError';
import { ErrorRequestHandler, NextFunction } from 'express';

/**
 * @description This request handler sends the index.html build file to the client. For production.
 * @param {ITypedRequest} Request Express request object
 * @param {ITypedResponse} Response Express response object
 * @returns {any}
 */
export const productionHandler: IRequestHandler = async (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
};

/**
 * @description Global middleware handler is the final handler in the middleware chain that returns 404-invalid url error to the client.
 * @param {ITypedRequest} Request Express request object
 * @param {ITypedResponse} Response Express response object
 * @param {NextFunction} Next Express next function.
 * @returns {any}
 */
export const globalMiddleware: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  next(new AppError('Request failed to invalid URL', 404));
};
