const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const path = require("path");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: "frontend_URL",
    credentials: true,
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
module.exports = app;
