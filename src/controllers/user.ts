import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { RequestError, NotFoundError, ConflictError } from '../errors';
import { SessionRequest } from '../utils/interfaces';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(new Error('UserNotFound'))
    .then((user) => {
      const {
        name, _id, about, avatar,
      } = user;
      res.status(201).send({
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
  const { email, password, name, about, avatar } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error('UserHasFound')
      } else {
        hash(password, 10)
          .then(hash =>
            User.create({
              email,
              password: hash,
              name,
              about,
              avatar,
            })
            .then((user) => {
              const { email, name, about, avatar } = user;
              res.status(201).send({ email, name, about, avatar })
            })
          )
      }
    })
    .catch((err) => {
      switch (err.message) {
        case 'UserHasFound': {
          next(new ConflictError('Пользователь с таким email существует'));
          break;
        }
        default: next(new RequestError('Ошибка при создании нового пользователя'));
      }
    })
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findOne({ email }).select('+password')
    .orFail(new Error('UserNotFound'))
    .then((user) => {
      compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            return res.status(201).send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET as string : 'dev-secret-phrase', { expiresIn: '7d' }) })
          } else {
            throw new Error('Неправильный email или пароль')
          }
        })
      }
    )
    .catch((err: Error) => {
      switch (err.message) {
        case 'UserNotFound': {
          next(new RequestError('Неправильный email или пароль'));
          break;
        }
        default: next(new RequestError('Ошибка при авторизации пользователя'));
      }
    })
}

export const updateUserInfo = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
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
  const { avatar } = req.body;
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
