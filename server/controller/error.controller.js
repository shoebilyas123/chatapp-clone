const AppError = require("../utils/appError");

const handleCastErrDB = (err) => {
  const errorMessage = `Invalid ${err.path}: ${err.value}`;
  return new AppError(errorMessage, 400);
};

const handleDuplicateErrDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleJWTErr = (err) => {
  return new AppError(err.message, 500);
};

const handleValidationErrorDB = (err) => {
  const errs = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${errs.join(". ")}`;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
    errorInDev: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log({ err });

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") {
      error = handleCastErrDB(error);
    } else if (error.name === "JsonWebTokenError") {
      error = handleJWTErr(error);
    } else if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateErrDB(error);
    }
    sendProdError(error, res);
  }
};
