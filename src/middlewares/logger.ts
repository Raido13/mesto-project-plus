import winston from 'winston';
import expressWinston from 'express-winston';

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'logs/request.log',
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
    }),
  ],
  format: winston.format.json(),
});

export {
  requestLogger,
  errorLogger,
};
