import { Router } from 'express';
import {
  getAllCards, createCard, addLike, deleteCard, removeLike,
} from '../controllers/card';
import { createCardValidation, cardIdValidation } from '../utils/consts';

const router = Router();

router.get('/', getAllCards);

router.post('/', createCardValidation, createCard);

router.put('/:cardId/likes', cardIdValidation, addLike);

router.delete('/:cardId', cardIdValidation, deleteCard);

router.delete('/:cardId/likes', cardIdValidation, removeLike);

export default router;
