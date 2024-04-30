const winston = require("winston");
const { combine, timestamp, printf, align } = winston.format;

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "./api.log" }),
    new winston.transports.Console(),
  ],
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),

    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
});

module.exports = logger;
