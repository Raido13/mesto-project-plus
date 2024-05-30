import { Request, Response, NextFunction } from "express";
import User from '../models/user';
import { NotFoundError } from "../errors/errors";

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { user, name, about } = req.body;
  const _id = user?._id;

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: name,
        about: about
      }
    }
  )
  .then(user => res.status(200).send(user))
  .catch((err: Error) => {
    err.name
      ? next(new NotFoundError('Пользователь с таким ID не найден'))
      : next(err)
  })
}

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar, user } = req.body;
  const _id = user?._id;

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        avatar: avatar
      }
    }
  )
    .then(user => res.status(200).send({ avatar: user?.avatar }))
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Пользователь с таким ID не найден'))
        : next(err)
    })
}