const { AppError } = require("../../utils/error");

const errorController = (err, req, res, next) => {
  console.log("xxxxxxx", err.name);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) {
      err = handleMongooseDuplicateKeyError(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = handleJWTError();
    }
    if (err.name === "TokenExpiredError") {
      err = handleJWTExpiredError();
    }
    sendErrorProd(res, err);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  }
  next();
};

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    data: {
      message: err.message,
      error: err,
      stack: err.stack,
      clientErrorCode: err.clientErrorCode,
    },
  });
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired. Login again!", 401);
};

const handleMongooseDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field. Field: '${field}', Value: '${value}'`;
  return new AppError(message, 400);
};

const sendErrorProd = (res, err) => {
  if (!err.isOperational) {
    console.error("ERROR ❌", err);
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went very wrong!",
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      clientErrorCode: err.clientErrorCode,
    });
  }
};
module.exports = errorController;
