import { RequestHandler } from 'express';

import { signToken } from '../utils/auth';
import { generateAvatarColor } from '../utils/generics';
import User from './../models/user.model';
import { createRoom } from '../utils/socket';
import AppError from './../utils/appError';
import { expressAsyncHandler } from '../utils/expressAsyncHandler';

interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
}

export const register = expressAsyncHandler<{}>(async (req, res, next) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password) {
    next(new AppError('Name, email and password are mandatory', 400));
    return;
  }

  if (name?.length < 5) {
    return next(new AppError('Name must be 5 characters or more', 400));
  }

  if (password?.length < 8) {
    return next(new AppError('Password must be 8 characters or more', 400));
  }

  const payload = {
    name,
    email,
    password,
    profilePic: profilePic || '',
    avatarColor: generateAvatarColor(),
  };

  const newUser = await User.create(payload);
  const accessToken = signToken(newUser._id);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    profilePic: newUser.profilePic,
    avatarColor: newUser.avatarColor,
    accessToken,
    id: newUser._id,
  });
});

export const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError('Email and password are required', 404));
    return;
  }

  const userAuth = await User.findOne({ email });

  if (!userAuth) {
    next(new AppError('User has either been deleted or does not exist.', 404));
    return;
  }
  const isPasswordValid = await userAuth.isPasswordValid(
    userAuth.password,
    password
  );

  if (!isPasswordValid) {
    next(new AppError('Please provide a correct password', 400));
    return;
  }
  const user = await User.findOne({ email }).select('-password');

  const accessToken = signToken(user._id);
  res.status(201).json({
    userInfo: user,
    accessToken,
  });
});

export const getCurrentUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'sentRequests',
      select: 'name avatarColor _id profilePic',
    })
    .populate({
      path: 'pendingRequests',
      select: 'name avatarColor _id profilePic',
    })
    .populate({
      path: 'friends',
      select: 'name avatarColor _id profilePic',
    })
    .select('-password');

  if (!user) {
    next(new AppError('User has either been deleted or does not exist.', 404));
  }

  res.status(201).json(user);
});

export const changePassword = async (req, res, next) => {
  try {
    res.send('hello');
  } catch (error) {
    res.send('error');
  }
};

export const updateProfilePic = expressAsyncHandler(async (req, res, next) => {
  const profile = req.body.profilePic;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePic: profile,
    },
    { new: true }
  ).select('profilePic');

  res.status(200).json(user.profilePic);
});

export const removeProfilePic = expressAsyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { profile: '' },
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile picture removed successfully',
  });
});

export const getChatsFor = expressAsyncHandler(async (req, res, next) => {
  const connectTo = req.params.id;

  const roomId = createRoom(req.user._id, connectTo);

  const chatHistory = await User.aggregate([
    {
      $match: { _id: req.user._id },
    },
    {
      $project: {
        chatHistory: 1,
        chatHistory: {
          $filter: {
            input: '$chatHistory',
            as: 'chatMessage',
            cond: {
              $eq: ['$$chatMessage.room', roomId],
            },
          },
        },
      },
    },
  ]);
  const chats = chatHistory[0].chatHistory;
  res.status(200).json(chats);
});

export const removeFriend = expressAsyncHandler(async (req, res, next) => {
  const { removeId } = req.body;

  const options = {
    $pull: { friends: removeId },
  };
  const user = await User.findByIdAndUpdate(req.user._id, options, {
    new: true,
  })
    .populate({ path: 'friends', select: '_id name profilePic avatarColor' })
    .select('friends pendingRequests');
  await User.findByIdAndUpdate(
    removeId,
    {
      $pull: { friends: req.user._id },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ friends: user.friends, pendingRequests: user.pendingRequests });
});

export const updateUserInfo = expressAsyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true }
  )
    .populate({
      path: 'sentRequests',
      select: 'name avatarColor _id profilePic',
    })
    .populate({
      path: 'pendingRequests',
      select: 'name avatarColor _id profilePic',
    })
    .populate({
      path: 'friends',
      select: 'name avatarColor _id profilePic',
    })
    .select('-password');
  res.status(200).json(user);
});
