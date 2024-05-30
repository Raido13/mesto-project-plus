import { Request, Response, NextFunction } from "express";
import Card from '../models/card';
import User from '../models/user';
import { NotFoundError, RequestError } from "../errors/errors";

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then(cards => res.status(201).send(cards))
    .catch(next)
}

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { user, name, link } = req.body;
  const _id = user?._id;

  return Card.create({
    name: name,
    link: link,
    owner: _id,
    createCard: Date.now()
  })
    .then(card => res.send(card))
    .catch((err: Error) => {
      switch(err.name) {
        case 'ValidationError': next(new RequestError('Некорректные данные при создании карточки'));
        case 'CastError': next(new RequestError('Некорректные данные при создании карточки'));
        default: next(err)
      }
    });
}

export const addLike = (req: Request, res: Response, next: NextFunction) => {
  const { user, cardId } = req.body;
  const _id = user?._id;

  return User.findById(_id)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким ID не существует')
      }
      return Card.findByIdAndUpdate(
        cardId,
        {$addToSet: { likes: _id }}
      )
        .then(() => res.status(200).send({ message: 'Добавлен Лайк' }))
        .catch((err: Error) => {
          err.name
            ? next(new NotFoundError('Карточка с таким ID не существует'))
            : next(err)
        })
    })
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Пользователь с таким ID не существует'))
        : next(err)
    })
}

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { user, cardId } = req.body;
  const _id = user?._id;

  return Card.findByIdAndDelete({ cardId })
    .then(() => res.status(200).send({}))
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Карточка с таким ID не существует'))
        : next(err)
    })
}

export const removeLike = (req: Request, res: Response, next: NextFunction) => {
  const { user, cardId } = req.body;
  const _id = user?._id;

  return User.findById(_id)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким ID не существует');
      }
      return Card.findByIdAndUpdate(
        cardId,
        {$addToSet: { likes: _id }}
      )
        .then(() => res.status(200).send({ message: 'Лайк убран' }))
        .catch((err: Error) => {
          err.name
            ? next(new RequestError('Неудачная попытка убрать лайк'))
            : next(err)
        })
    })
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Карточка с таким ID не существует'))
        : next(err)
    })
}