const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./db/db");
const errorController = require("./components/error/errorController");
const { AppError } = require("./utils/error");

const indexRouter = require("./routes/index");
const routerV2 = require("./routes/routesV2");

const app = express();

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
