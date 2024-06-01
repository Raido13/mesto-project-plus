import { Request, Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import Card from '../models/card';
import { NotFoundError, RequestError, UnexpectedError } from '../errors';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

export const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.query;
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
    .orFail(new Error('CardNotFound'))
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

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findOneAndDelete({ cardId })
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

  return Card.findOneAndUpdate({
    cardId,
    $pull: { likes: userId },
  })
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
