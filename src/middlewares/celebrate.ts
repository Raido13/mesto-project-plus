import { CelebrateError, isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import { RequestError } from '../errors';

const celebrateHandler = (err: CelebrateError, req: Request, res: Response, next: NextFunction) => {
  if (!isCelebrateError(err)) {
    return next(err);
  }

  if (err.details.get('params')) {
    throw new RequestError(`Ошибка валидации параметра ${err.details.get('params')?.details[0].message.split(' ')[0]}`);
  } else if (err.details.get('body')) {
    throw new RequestError(`Ошибка валидации поля ${err.details.get('body')?.details[0].message.split(' ')[0]}`);
  } else {
    next(err);
  }
};

export default celebrateHandler;
