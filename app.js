const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();
require("./db/db");
const errorController = require("./components/error/errorController");
const { AppError } = require("./utils/error");

const indexRouter = require("./routes/index");
const routerV2 = require("./routes/routesV2");

const app = express();
// Set HTTP headers for security
app.use(helmet());

// API rate limiting for same IP
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/v2", rateLimiter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

const allowedOrigins = [
  "http://localhost:3000",
  "https://imagex.yashpratapsingh.com",
];

app.use(
  cors({
    // TODO: Production env here
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(logger("dev"));
// Security measure to restrict body size
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/v2", routerV2);

app.all(/.*/, (req, res, next) => {
  next(
    new AppError(`Route ${req.originalUrl} doesn't exist on the server`, 404)
  );
});

// Global error handling middleware
app.use(errorController);

module.exports = app;

/**
 * TODO:
 * Security measures:
 * 1) HPP prevention (using Zod)
 * 2) Use Zod for input validation
 * 3) Use npm xss for manual sanitization (if needed) of strings (after zod validation)
 * 4) Set Content Security Policy header in helmet (if needed)
 */
