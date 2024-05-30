import { Router } from "express";
import { getAllUsers, getUser, createUser } from "../controllers/user";

const router = Router();

router.get('/:userId', getUser);
router.get('/', getAllUsers);
router.post('/', createUser)

export default router;