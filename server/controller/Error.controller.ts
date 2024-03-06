import { ErrorRequestHandler, NextFunction, Response, Request } from 'express';

import AppError from '../utils/appError';

const handleCastErrDB: ErrorRequestHandler = (err) => {
  const errorMessage = `Invalid ${err.path}: ${err.value}`;
  return new AppError(errorMessage, 400);
};

const handleDuplicateErrDB: ErrorRequestHandler = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleJWTErr: ErrorRequestHandler = (err) => {
  return new AppError(err.message, 500);
};

const handleValidationErrorDB: ErrorRequestHandler = (err) => {
  const errs = Object.values(err.errors).map((el) => (el as any).message);
  const message = `Invalid Input Data. ${errs.join('. ')}`;
  return new AppError(message, 400);
};

const sendDevError: ErrorRequestHandler = (err, _, res) => {
  res &&
    res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
      errorInDev: err,
      stack: err.stack,
    });
};

const sendProdError: ErrorRequestHandler = (err, _, res) => {
  if (err.isOperational) {
    res &&
      res.status(err.statusCode).json({
        status: err.status,
        error: err.message,
      });
  } else {
    res &&
      res.status(500).json({
        status: 'error',
        error: 'Something went wrong',
      });
  }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log({ err, env: process.env.NODE_ENV });

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErrDB(error, req, res, next);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTErr(error, req, res, next);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error, req, res, next);
    } else if (error.code === 11000) {
      error = handleDuplicateErrDB(error, req, res, next);
    }
    sendProdError(error, req, res, next);
  }
};
