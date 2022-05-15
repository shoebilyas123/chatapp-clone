const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const path = require("path");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const errorController = require("./controller/error.controller");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/public")));

//Data sanitization against xss attack
app.use(xss());
// Data sanitization against noSQL query injectoin
app.use(mongoSanitize());
// Set security http headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   error: "Request to invalid url",
  // });

  // const err = new Error("Request to invalid URL");
  // err.statusCode = 404;
  // err.status = "fail";
  // If the express function receives an argument it will assume it to be an error.
  // It will skip other middlewares and send it to our global error middleware
  next(new AppError("Request failed to invalid URL", 404));
});

app.use(errorController);

module.exports = app;
