import { Request, Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import Card from '../models/card';
import {
  ConflictError, NotFoundError, RequestError, UnexpectedError,
} from '../errors';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

export const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(201).send({ card }))
    .catch((err: Error) => {
      switch (err.name) {
        case 'ValidaitonError': {
          next(new RequestError('Переданы некорректные данные при создании карточки'));
          break;
        }
        default: next(err);
      }
    });
};

export const addLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then(() => res.status(200).send({ message: 'Добавлен Лайк' }))
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new NotFoundError('Карточка с таким ID не существует'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Переданы некорректные данные для постановки лайка'));
          break;
        }
        default: next(err);
      }
    });
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => (card!.owner.toString() === userId
      ? cardId
      : next(new ConflictError('Невозможно удалить чужую карточку'))))
    .then(() => Card.findOneAndDelete({ cardId }))
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new NotFoundError('Карточка с таким ID не существует'));
          break;
        }
        default: next(err);
      }
    });
};

export const removeLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then(() => {
      res.status(200).send({ message: 'Лайк убран' });
    })
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new NotFoundError('Карточка с таким ID не существует'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Переданы некорректные данные при снятии лайка'));
          break;
        }
        default: next(err);
      }
    });
};
