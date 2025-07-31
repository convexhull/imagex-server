var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();
require("./db/db");

var indexRouter = require("./routes/index");
const routerV2 = require("./routes/routesV2");

var app = express();

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
        callback(new Errror("Not allowed by CORS"));
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

// app.use(async (req, res, next) => {
//   await (() =>
//     new Promise((resolve, reject) => {
//       setTimeout(() => resolve(1), 2000);
//     }))();
//   next();
// });

app.use("/", indexRouter);
app.use("/v2", routerV2);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
