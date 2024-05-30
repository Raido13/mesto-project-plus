import { Request, Response, NextFunction } from "express";
import User from '../models/user';
import { RequestError, NotFoundError } from "../errors/errors";

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.userId;

  return User.findById(_id)
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден');
      res.send({ user })
    })
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Пользователь с таким ID не найден'))
        : next(err)
    })
}

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(next)
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({
    name: name,
    about: about,
    avatar: avatar
  })
    .then(user => res.status(201).send(user))
    .catch((err: Error) => {
      err.name
        ? next(new RequestError('Некорректные данные при создании пользователя'))
        : next(err)
    })
}