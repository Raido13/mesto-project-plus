import { Response, NextFunction } from "express";
import User from '../models/user';
import { NotFoundError, RequestError } from "../errors/errors";
import { SessionRequest } from "../utils/interfaces";

export const updateUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.query;
  const _id = req.user?._id;

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        name,
        about
      }
    }
  )
  .then(async (user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с таким ID не найден')
    }
    res.status(200).send({ _id, name, about });
  })
  .catch((err: Error) => {
    err.name
      ? next(new RequestError('Переданы некорректные данные при обновлении профиля'))
      : next(err)
  })
}

export const updateAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.query;
  const _id = req.user?._id;

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        avatar
      }
    }
  )
    .then(user => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким ID не найден')
      }
      res.status(200).send({ avatar })
    })
    .catch((err: Error) => {
      err.name
        ? next(new RequestError('Переданы некорректные данные при обновлении профиля'))
        : next(err)
    })
}