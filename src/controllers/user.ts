import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { RequestError, NotFoundError } from '../errors';
import { SessionRequest } from '../utils/interfaces';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(new Error('UserNotFound'))
    .then((user) => {
      const {
        name, _id, about, avatar,
      } = user;
      res.send({
        name, _id, about, avatar,
      });
    })
    .catch((err: Error) => {
      err.message === 'UserNotFound'
        ? next(new NotFoundError('Пользователь с таким ID не найден'))
        : next(new RequestError('Ошибка при запросе пользователя'));
    });
};

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(new RequestError('Ошибка при запросе пользователей')));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.query;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201).send({ user }))
    .catch(() => next(new RequestError('Некорректные данные при создании пользователя')));
};

export const updateUserInfo = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.query;
  const _id = req.user?._id;

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        name,
        about,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('UserNotFound'))
    .then(() => {
      res.status(200).send({ _id, name, about });
    })
    .catch((err: Error) => {
      switch (err.message) {
        case 'UserNotFound': {
          next(new NotFoundError('Пользователь с таким ID не существует'));
          break;
        }
        default: next(new RequestError('Ошибка при обновлении пользователя'));
      }
    });
};

export const updateUserAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.query;
  const _id = req.user?._id;

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        avatar,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('UserNotFound'))
    .then(() => {
      res.status(200).send({ avatar });
    })
    .catch((err: Error) => {
      switch (err.message) {
        case 'UserNotFound': {
          next(new NotFoundError('Пользователь с таким ID не существует'));
          break;
        }
        default: next(new RequestError('Ошибка при обновлении аватара пользователя'));
      }
    });
};
