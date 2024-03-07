// NPM imports
import { Router } from 'express';

// Local imports
import * as ChatController from '../controller/Chat.controller';
import { protect } from '../middleware/auth';

const router = Router();
router.post('/delete-one', protect, ChatController.deleteChatMsg);
router.post('/delete-all', protect, ChatController.deleteAllChats);
router.get('/all', protect, ChatController.getChats);

export default router;
