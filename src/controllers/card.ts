import { Request, Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import Card from '../models/card';
import User from '../models/user';
import { AuthError, NotFoundError, RequestError } from '../errors';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(201).send({ cards }))
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
    .catch(() => next(new RequestError('Некорректные данные при создании карточки')));
};

export const addLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return User.findById(userId)
    .orFail(new Error('UserNotFound'))
    .then(() => Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(new Error('CardNotFound'))
      .then(() => res.status(200).send({ message: 'Добавлен Лайк' }))
    )
    .catch((err: Error) => {
      switch (err.message) {
        case 'UserNotFound': {
          next(new NotFoundError('Пользователь с таким ID не существует'));
          break;
        }
        case 'CardNotFound': {
          next(new NotFoundError('Карточка с таким ID не существует'));
          break;
        }
        default: next(new RequestError('Ошибка при добавлении лайка'));
      }
    });
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return Card.findOneAndDelete({ cardId })
    .orFail(new Error('CardNotFound'))
    .then((card) =>
      card.owner === userId
        ? res.status(200).send({ message: 'Карточка удалена' })
        : new Error('NotAuthor')
    )
    .catch((err: Error) => {
      switch (err.message) {
        case 'NotAuthor': {
          next(new AuthError('Невозможно удалить чужую карточку'));
          break;
        }
        case 'CardNotFound': {
          next(new NotFoundError('Карточка с таким ID не существует'));
          break;
        }
        default: next(new RequestError('Ошибка при удалении карточки'));
      }
    });
};

export const removeLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { cardId } = req.params;

  return User.findById(userId)
    .orFail(new Error('UserNotFound'))
    .then(() => Card.findOneAndUpdate({
      cardId,
      $pull: { likes: userId },
    })
      .orFail(new Error('CardNotFound'))
      .then(() => {
        res.status(200).send({ message: 'Лайк убран' });
      })
    )
    .catch((err: Error) => {
      switch (err.message) {
        case 'UserNotFound': {
          next(new NotFoundError('Пользователь с таким ID не существует'));
          break;
        }
        case 'CardNotFound': {
          next(new NotFoundError('Карточка с таким ID не существует'));
          break;
        }
        default: next(new RequestError('Ошибка при удалении лайка'));
      }
    });
};
