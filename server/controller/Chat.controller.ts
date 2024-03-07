import Chats from '../models/chat.model';
import { expressAsyncHandler } from '../utils/expressAsyncHandler';
import { createRoom } from '../utils/socket';

// Custom type imports
import { IChatHistory } from '../types/models/chats';

export const getChats = expressAsyncHandler<{}, {}, Partial<IChatHistory>>(
  async (req, res, next) => {
    const chatDoc = await Chats.findOne({ userId: req.user.id }).lean();

    res.status(200).json(chatDoc || {});
  }
);

interface IDeleteChatReq {
  to: string;
}
export const deleteAllChats = expressAsyncHandler<{}, IDeleteChatReq>(
  async (req, res, next) => {
    const { to } = req.body;

    const roomKey = createRoom(req.user?.id as string, to);
    const chatUpdateOptions = {
      $set: { chatHistory: [] },
    };

    await Chats.findOneAndUpdate({ roomId: roomKey }, chatUpdateOptions, {
      new: true,
    });
    res
      .status(200)
      .json({ status: 'success', message: 'Chats deleted successfully' });
  }
);

interface IDeleteMsgReq {
  sentAt: number;
}

export const deleteChatMsg = expressAsyncHandler<{}, IDeleteMsgReq>(
  async (req, res, next) => {
    const _myChats = await Chats.findOne({ userId: req.user.id });

    if (!_myChats) {
      return res.status(200).json({ history: [], userId: req.user.id });
    }

    const updatedChatHistory = _myChats?.history.filter(
      (ch) => ch.sentAt !== req.body.sentAt
    );
    _myChats.history = updatedChatHistory;
    _myChats?.save();

    res.status(200).json(_myChats);
  }
);
