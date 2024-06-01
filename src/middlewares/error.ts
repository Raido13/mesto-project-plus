import { Request, Response, NextFunction } from 'express';
import { SessionError } from '../utils/interfaces';

export default (err: SessionError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ошибка на сервере'
      : message,
  });
};
