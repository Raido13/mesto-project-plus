import { Router } from 'express';
import {
  getAllCards, createCard, addLike, deleteCard, removeLike,
} from '../controllers/card';
import { createCardValidation, updateCardValidation } from '../utils/consts';

const router = Router();

router.get('/', getAllCards);

router.post('/', createCardValidation, createCard);

router.put('/:cardId/likes', updateCardValidation, addLike);

router.delete('/:cardId', updateCardValidation, deleteCard);

router.delete('/:cardId/likes', updateCardValidation, removeLike);

export default router;
