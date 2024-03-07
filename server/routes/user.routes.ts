import { Router } from 'express';
import * as UserController from '../controller/User.controller';
import { protect } from '../middleware/auth';

const router = Router();
router.get('/', protect, UserController.getAllUsers);
router.get('/:id', protect, UserController.getUser);

export default router;
