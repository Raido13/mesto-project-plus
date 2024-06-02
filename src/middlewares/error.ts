import { Request, Response, NextFunction } from 'express';
import { SessionError } from '../utils/interfaces';
import { StatusCodes } from '../utils/statusCodes';

export default (err: SessionError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = StatusCodes.Unexpect, message } = err;

  res.status(statusCode).send({
    message: statusCode === StatusCodes.Unexpect
      ? 'Ошибка на сервере'
      : message,
  });
};
