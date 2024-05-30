import { Router } from "express";
import { getAllCards, createCard, addLike, deleteCard, removeLike } from "../controllers/card";

const router = Router();

router.get('/', getAllCards);
router.post('/', createCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', removeLike);

export default router;