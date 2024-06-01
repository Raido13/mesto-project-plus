import winston from 'winston';
import { logger } from 'express-winston';

const requestLogger = logger({
  transports: [
    new winston.transports.File({
      filename: 'logs/request.log',
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = logger({
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
