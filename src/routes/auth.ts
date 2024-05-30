import { Router } from 'express';
import { updateAvatar, updateUser } from '../controllers/auth';

const router = Router();

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
