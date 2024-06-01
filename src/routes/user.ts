import { Router } from 'express';
import {
  getAllUsers, getUser, updateUserInfo, updateUserAvatar
} from '../controllers/user';
import { getUserValidation, updateUserInfoValidation, updateUserAvatarValidation } from '../utils/consts';

const router = Router();

router.get('/:userId', getUserValidation, getUser);

router.get('/', getAllUsers);

router.patch('/me', updateUserInfoValidation, updateUserInfo);

router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default router;