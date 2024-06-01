import { Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthError } from '../errors';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!authorization) {
    throw new AuthError('Тебуется авторизация')
  }

  let user;

  try {
    user = jwt.verify(
      authorization.split(' ')[1],
      NODE_ENV === 'production' ? JWT_SECRET as string : 'dev-secret-phrase'
    )
  } catch (err) {
    next(new AuthError('Тебуется авторизация'));
    return
  }

  req.user = user as JwtPayload;

  next();
};
