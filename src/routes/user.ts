import { Router } from 'express';
import {
  getAllUsers, getUser, updateUserInfo, updateUserAvatar,
} from '../controllers/user';
import { updateUserInfoValidation, updateUserAvatarValidation } from '../utils/consts';

const router = Router();

router.get('/', getAllUsers);

router.get('/me', getUser);

router.patch('/me', updateUserInfoValidation, updateUserInfo);

router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default router;
