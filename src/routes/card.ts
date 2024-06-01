import { Router } from 'express';
import {
  getAllCards, createCard, addLike, deleteCard, removeLike,
} from '../controllers/card';
import { createCardValidation } from '../utils/consts';

const router = Router();

router.get('/', getAllCards);

router.post('/', createCardValidation, createCard);

router.put('/:cardId/likes', addLike);

router.delete('/:cardId', deleteCard);

router.delete('/:cardId/likes', removeLike);

export default router;
