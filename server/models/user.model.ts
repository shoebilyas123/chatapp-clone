import { IUser } from '../types/models/users';

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [5, 'Name must be more than or equal to 5 characters'],
    unique: true,
    required: [true, 'User must have a name'],
  },
  email: { type: String, required: [true, 'User must have an email'] },
  password: {
    type: String,
    minlength: [8, 'Password must be more than or equal to 8 characters'],
    required: [true, 'User must have a password'],
  },
  profilePic: { type: String, default: '' },
  friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  pendingRequests: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  sentRequests: [{ type: mongoose.Types.ObjectId, ref: 'User' }],

  avatarColor: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 15);
  next();
});

userSchema.methods.isPasswordValid = async function (
  hashedPassword: string,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export default mongoose.model('User', userSchema);
