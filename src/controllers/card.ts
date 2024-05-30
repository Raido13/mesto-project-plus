import { Request, Response, NextFunction } from "express";
import Card from '../models/card';
import User from '../models/user';
import { NotFoundError, RequestError } from "../errors/errors";
import { SessionRequest } from "utils/interfaces";

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then(cards => res.status(201).send({ cards }))
    .catch(next)
}

export const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.query;
  const owner = req.user?._id;

  return Card.create({
    name,
    link,
    owner,
    createCard: Date.now()
  })
    .then(card => res.send({ card }))
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Некорректные данные при создании карточки'))
        : next(err)
    })
}

export const addLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return User.findById(userId)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайка')
      }
      return Card.findByIdAndUpdate(
        cardId,
        {$addToSet: { likes: userId }}
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
        ? next(new NotFoundError('Переданы некорректные данные для постановки лайка'))
        : next(err)
    })
}

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findOneAndDelete({ cardId })
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Карточка с таким ID не существует'))
        : next(err)
    })
}

export const removeLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return User.findById(userId)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайка');
      }
      return Card.findOneAndUpdate({
        cardId,
        $pull: { likes: userId }
      })
        .then(() => {
          res.status(200).send({ message: 'Лайк убран' })
        })
        .catch((err: Error) => {
          err.name
            ? next(new RequestError('Неудачная попытка убрать лайк'))
            : next(err)
        })
    })
    .catch((err: Error) => {
      err.name
        ? next(new NotFoundError('Переданы некорректные данные для постановки лайка'))
        : next(err)
    })
}