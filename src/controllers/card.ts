import { Request, Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import Card from '../models/card';
import { ConflictError, RequestError, UnexpectedError } from '../errors';

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
    .catch(() => next(new UnexpectedError('Некорректные данные при создании карточки')));
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
          next(new RequestError('Карточка с таким ID не существует'));
          break;
        }
        case 'ValidaitonError': {
          next(new RequestError('Карточка с таким ID не существует'));
          break;
        }
        default: next(new UnexpectedError('Ошибка при добавлении лайка'));
      }
    });
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return Card.findOneAndDelete({ cardId })
    .then((card) =>
      card!.owner === userId
        ? res.status(200).send({ message: 'Карточка удалена' })
        : next(new ConflictError('Невозможно удалить чужую карточку'))
    )
    .catch((err: Error) => {
      switch (err.name) {
        case 'CastError': {
          next(new RequestError('Карточка с таким ID не существует'));
          break;
        }
        default: next(new UnexpectedError('Ошибка при удалении карточки'));
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
          next(new RequestError('Карточка с таким ID не существует'));
          break;
        }
        default: next(new UnexpectedError('Ошибка при удалении лайка'));
      }
    });
};
