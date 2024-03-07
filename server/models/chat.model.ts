import mongoose from 'mongoose';
import { IChatHistory } from '../types/models/chats';

const schema = new mongoose.Schema<IChatHistory>({
  userId: { type: String, unique: true, required: true },
  history: [
    {
      from: { type: mongoose.Types.ObjectId, required: true },
      to: { type: mongoose.Types.ObjectId, required: true },
      message: { type: String, required: true },
      sentAt: { type: Date, required: true },
      attachment: String,
    },
  ],
});

export default mongoose.model('Chat', schema);
