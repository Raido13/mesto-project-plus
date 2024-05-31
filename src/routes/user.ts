import { Router } from 'express';
import {
  getAllUsers, getUser, createUser, updateUserInfo, updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/:userId', getUser);
router.get('/', getAllUsers);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
