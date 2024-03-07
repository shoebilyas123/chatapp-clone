import { Router } from 'express';
import * as AuthController from '../controller/Auth.controller';
import { protect } from '../middleware/auth';

const router = Router();
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/my-info', protect, AuthController.getCurrentUser);
router.post('/profile-pic', protect, AuthController.updateProfilePic);
router.put('/profile-pic/remove', protect, AuthController.removeProfilePic);
router.post('/friends/remove', protect, AuthController.removeFriend);
router.post('/update', protect, AuthController.updateUserInfo);

router.post('/invite', protect, AuthController.inviteUser);
router.get('/requests', protect, AuthController.getFriendRequests);
router.post('/invite/accept', protect, AuthController.acceptInvite);
router.get('/profile-pic/upload', protect, AuthController.uploadProfilePic);

export default router;
