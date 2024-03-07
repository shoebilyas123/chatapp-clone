import { RequestHandler } from 'express';

import { signToken } from '../utils/auth';
import { generateAvatarColor } from '../utils/generics';
import User from './../models/user.model';
import AppError from './../utils/appError';
import { expressAsyncHandler } from '../utils/expressAsyncHandler';
import { getS3SignedURL } from '../utils/s3';

// Custom type imports
import { IInviteRequests, IUser } from '../types/models/users';

interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
}

interface IRegisterResponse extends IUser {
  accessToken: string;
}

export const register = expressAsyncHandler<
  {},
  IRegisterBody,
  IRegisterResponse
>(async function (req, res, next) {
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
  const accessToken = signToken(newUser.id);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    profilePic: newUser.profilePic,
    avatarColor: newUser.avatarColor,
    accessToken,
    id: newUser.id,
  });
});

interface ILoginRq {
  email: string;
  password: string;
}

interface ILoginRs extends IRegisterResponse {}

export const login = expressAsyncHandler<{}, ILoginRq, ILoginRs>(
  async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      next(new AppError('Email and password are required', 404));
      return;
    }

    const userAuth = await User.findOne({ email });

    if (!userAuth) {
      next(
        new AppError('User has either been deleted or does not exist.', 404)
      );
      return;
    }
    // @ts-ignore-next-line
    const isPasswordValid = await userAuth.isPasswordValid(
      userAuth.password,
      password
    );

    if (!isPasswordValid) {
      next(new AppError('Please provide a correct password', 400));
      return;
    }

    const accessToken = signToken(userAuth.id);
    res.status(201).json({
      name: userAuth.name,
      email: userAuth.email,
      profilePic: userAuth.profilePic,
      avatarColor: userAuth.avatarColor,
      id: userAuth.id,
      accessToken,
    });
  }
);

export const getCurrentUser = expressAsyncHandler<{}, {}, IUser>(
  async (req, res, next) => {
    const user = await User.findById(req.user.id)
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
      return next(
        new AppError('User has either been deleted or does not exist.', 404)
      );
    }

    res.status(201).json(user);
  }
);

interface IUpdatePFPRq {
  profilePic: IUser['profilePic'];
}

type IUpdatePFPRs = string;

export const updateProfilePic = expressAsyncHandler<
  {},
  IUpdatePFPRq,
  IUpdatePFPRs
>(async (req, res, next) => {
  const profile = req.body.profilePic;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profilePic: profile,
    },
    { new: true }
  ).select('profilePic');

  res.status(200).json((user && user.profilePic) || '');
});

export const removeProfilePic = expressAsyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $set: { profile: '' },
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile picture removed successfully',
  });
});

interface IRemFrRq {
  removeId: string;
}
interface IRemFrRs {
  friends: IUser['friends'];
}
export const removeFriend = expressAsyncHandler<{}, IRemFrRq, IRemFrRs>(
  async (req, res, next) => {
    const { removeId } = req.body;

    const options = {
      $pull: { friends: removeId },
    };
    const user = await User.findByIdAndUpdate(req.user.id, options, {
      new: true,
    })
      .populate({ path: 'friends', select: '_id name profilePic avatarColor' })
      .select('friends');

    await User.findByIdAndUpdate(
      removeId,
      {
        $pull: { friends: req.user.id },
      },
      { new: true }
    );

    res.status(200).json({
      friends: user?.friends || [],
    });
  }
);

interface IUpdateInfoRq {
  email: string;
  name: string;
}

export const updateUserInfo = expressAsyncHandler<{}, IUpdateInfoRq>(
  async (req, res, next) => {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email, name },
      { new: true }
    ).select('-password');

    res.status(200).json({ email: user?.email, name: user?.name });
  }
);

export const uploadProfilePic = expressAsyncHandler<
  {},
  {},
  {},
  { fileName: string; fileType: string }
>(async (req, res) => {
  const fileName = req.query.fileName.split('.')[0];
  const fileType = req.query.fileType.split('/')[1];
  const url = await getS3SignedURL(fileName, fileType, req.user.id as string);
  res.status(200).json({ url });
});

interface IInviteUserReq {
  from: string;
  to: string;
}

interface IInviteUserRes {
  sent: IInviteRequests | null;
}

export const inviteUser = expressAsyncHandler<
  {},
  IInviteUserReq,
  IInviteUserRes
>(async (req, res) => {
  const { from, to } = req.body;

  const optionsTo = {
    $push: { pendingRequests: from },
  };

  const optionsFrom = {
    $push: { sentRequests: to },
  };

  const user = await User.findByIdAndUpdate(to, optionsTo)
    .select('name profilePic avatarColor _id')
    .lean();
  await User.findByIdAndUpdate(req.user.id, optionsFrom);

  const sent: IInviteRequests = {
    _id: user?.id as string,
    name: user?.name as string,
    profilePic: user?.profilePic as string,
    avatarColor: user?.avatarColor as string,
  };

  res.status(200).json({ sent: sent || null });
});

interface IAcceptInviteReq {
  acceptId: string;
}
export const acceptInvite = expressAsyncHandler<{}, IAcceptInviteReq>(
  async (req, res) => {
    const { acceptId } = req.body;

    const options = {
      $push: { friends: acceptId },
      $pull: { pendingRequests: acceptId },
    };
    const user = await User.findByIdAndUpdate(req.user.id, options, {
      new: true,
    })
      .populate({ path: 'friends', select: '_id name profilePic avatarColor' })
      .select('friends pendingRequests');
    await User.findByIdAndUpdate(
      acceptId,
      {
        $push: { friends: req.user.id },
        $pull: { sentRequests: req.user.id },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ friends: user?.friends, pendingRequests: user?.pendingRequests });
  }
);

export const getFriendRequests = expressAsyncHandler(async (req, res) => {
  const friendsInfo = await User.findById(req.user.id)
    .populate({
      path: 'pendingRequests',
      select: 'name profilePic _id avatarColor',
    })
    .populate({
      path: 'sentRequests',
      select: 'name profilePic _id avatarColor',
    })
    .select('pendingRequests sentRequests')
    .lean();

  res.status(200).json(friendsInfo || {});
});
