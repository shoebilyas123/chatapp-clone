import User from '../models/user.model';
import { IInviteRequests, IUser } from '../types/models/users';
import AppError from '../utils/appError';
import { expressAsyncHandler } from '../utils/expressAsyncHandler';
import { getS3SignedURL } from '../utils/s3';
import { createRoom } from '../utils/socket';

interface IGetUsersRs extends IUser {}
export const getAllUsers = expressAsyncHandler<
  {},
  {},
  IGetUsersRs[],
  { search: string }
>(async (req, res) => {
  const searchTerm = req.query.search;

  const options = {
    email: { $ne: req.user.email },
    ...(searchTerm && { name: new RegExp(searchTerm, 'g') }),
  };

  const users = await User.find(options).select('-password');
  res.status(200).json(users);
});

export const getUser = expressAsyncHandler<
  { id: string },
  {},
  { user: Partial<IUser> }
>(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ user: user || {} });
});
