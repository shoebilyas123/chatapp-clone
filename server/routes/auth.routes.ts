import { Router } from 'express';
import * as AuthController from '../controller/Auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/my-info', protect, AuthController.getCurrentUser);
router.post('/password-change', protect, AuthController.changePassword);
router.post('/profile-pic', protect, AuthController.updateProfilePic);
router.put('/profile-pic/remove', protect, AuthController.removeProfilePic);
router.get('/chats/:id', protect, AuthController.getChatsFor);
router.post('/friends/remove', protect, AuthController.removeFriend);
router.post('/update', protect, AuthController.updateUserInfo);

export default router;
