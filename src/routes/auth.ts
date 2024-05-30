import { updateAvatar, updateUser } from "../controllers/auth";
import { Router } from "express";

const router = Router();

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;