class AppError extends Error {
  constructor(message, statusCode, clientErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // For displaying error message on client
    this.clientErrorCode = clientErrorCode;
    this.isOperational = true;
  }
}

module.exports = {
  AppError,
};
