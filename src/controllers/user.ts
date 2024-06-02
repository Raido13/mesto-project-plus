import { Request, Response, NextFunction } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { RequestError, ConflictError } from '../errors';
import { SessionRequest } from '../utils/interfaces';
import { StatusCodes } from '../utils/statusCodes';

export const getUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  return User.findById(userId)
    .then((user) => {
      const {
        name, _id, about, avatar,
      } = user!;
      res.status(StatusCodes.Success).send({
        name, _id, about, avatar,
      });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        default: next(err);
      }
    });
};

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    body,
  } = req;

  User.findOne({ email: body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email существует');
      } else {
        hash(body.password, 10)
          .then((cryptedPassword) => User.create({
            email: body.email,
            password: cryptedPassword,
            name: body.name,
            about: body.about,
            avatar: body.avatar,
          })
            .then(({
              email, name, about, avatar,
            }) => res.status(StatusCodes.Created).send({
              email, name, about, avatar,
            })));
      }
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidaitonError': {
          next(new RequestError('Переданы некорректные данные при создании пользователя'));
          break;
        }
        default: next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      compare(password, user!.password)
        .then((isMatch) => {
          if (isMatch) {
            return res.status(StatusCodes.Created).send({ token: jwt.sign({ _id: user!._id }, NODE_ENV === 'production' ? JWT_SECRET as string : 'dev-secret-phrase', { expiresIn: '7d' }) });
          }
          throw new RequestError('Неправильный email или пароль');
        });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Неправильный email или пароль'));
          break;
        }
        default: next(err);
      }
    });
};

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
    .then(() => {
      res.status(StatusCodes.Success).send({ _id, name, about });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Переданы некорректные данные при обновлении профиля'));
          break;
        }
        default: next(err);
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
    .then(() => {
      res.status(StatusCodes.Success).send({ avatar });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Пользователь с таким ID не найден'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Переданы некорректные данные при обновлении профиля'));
          break;
        }
        default: next(err);
      }
    });
};
