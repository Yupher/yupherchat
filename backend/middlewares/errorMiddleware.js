const logger = require("../config/logger");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(
    `${req.method} ${req.url} | frontend origin: ${
      req.headers.origin ||
      req.headers.referer ||
      req.headers["x-frontend-origin"]
    } | ${err.stack}`,
  );
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
