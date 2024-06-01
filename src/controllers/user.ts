import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { RequestError, UnexpectedError } from '../errors';
import { SessionRequest } from '../utils/interfaces';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      res.send({
        user
      });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        default: next(new UnexpectedError('Ошибка при запросе пользователя'));
      }
    });
};

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(new UnexpectedError('Ошибка при запросе пользователей')));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.query;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201).send({ user }))
    .catch(() => next(new UnexpectedError('Некорректные данные при создании пользователя')));
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
    .then(() => {
      res.status(200).send({ _id, name, about });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        default: next(new UnexpectedError('Ошибка при запросе пользователя'));
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
    .then(() => {
      res.status(200).send({ avatar });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        default: next(new UnexpectedError('Ошибка при запросе пользователя'));
      }
    });
};
