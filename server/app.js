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

const awsURL =
  "https://shoebilyas-chats-profile-pic.s3.ap-south-1.amazonaws.com";

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

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
app.use(
  helmet()
  //   {
  //   contentSecurityPolicy: {
  //     useDefaults: true,
  //     directives: {
  //       // other directives

  //       "img-src": ["'self'", awsURL],
  //     },
  //   },
  //   // referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // }
);
// strict-origin-when-cross-origin

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

app.use(errorController);

module.exports = app;
