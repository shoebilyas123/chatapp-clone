const { signToken } = require("../utils/auth");
const { generateAvatarColor } = require("../utils/generics");
const User = require("./../models/user.model");
const { createRoom } = require("../utils/socket");
const AppError = require("./../utils/appError");
const { expressAsyncHandler } = require("../utils/expressAsyncHandler");

exports.register = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password) {
    next(new AppError("Name, email and password are mandatory", 400));
    return;
  }

  const payload = {
    name,
    email,
    password,
    profilePic: profilePic || "",
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

exports.login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Email and password are required", 404));
    return;
  }

  const userAuth = await User.findOne({ email });

  if (!userAuth) {
    next(new AppError("User has either been deleted or does not exist.", 404));
    return;
  }
  const isPasswordValid = await userAuth.isPasswordValid(
    userAuth.password,
    password
  );

  if (!isPasswordValid) {
    next(new AppError("Please provide a correct password", 400));
    return;
  }
  const user = await User.findOne({ email }).select("-password");

  const accessToken = signToken(user._id);
  res.status(201).json({
    userInfo: user,
    accessToken,
  });
});

exports.getCurrentUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "sentRequests",
      select: "name avatarColor _id profilePic",
    })
    .populate({
      path: "pendingRequests",
      select: "name avatarColor _id profilePic",
    })
    .populate({
      path: "friends",
      select: "name avatarColor _id profilePic",
    })
    .select("-password");

  if (!user) {
    next(new AppError("User has either been deleted or does not exist.", 404));
  }

  res.status(201).json(user);
});

exports.changePassword = async (req, res, next) => {
  try {
    res.send("hello");
  } catch (error) {
    res.send("error");
  }
};

exports.updateProfilePic = expressAsyncHandler(async (req, res, next) => {
  const profile = req.body.profilePic;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePic: profile,
    },
    { new: true }
  ).select("profilePic");

  res.status(200).json(user.profilePic);
});

exports.removeProfilePic = expressAsyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { profile: "" },
  });

  res.status(200).json({
    status: "success",
    message: "Profile picture removed successfully",
  });
});

exports.getChatsFor = expressAsyncHandler(async (req, res, next) => {
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
            input: "$chatHistory",
            as: "chatMessage",
            cond: {
              $eq: ["$$chatMessage.room", roomId],
            },
          },
        },
      },
    },
  ]);
  const chats = chatHistory[0].chatHistory;
  res.status(200).json(chats);
});

exports.removeFriend = expressAsyncHandler(async (req, res, next) => {
  const { removeId } = req.body;

  const options = {
    $pull: { friends: removeId },
  };
  const user = await User.findByIdAndUpdate(req.user._id, options, {
    new: true,
  })
    .populate({ path: "friends", select: "_id name profilePic avatarColor" })
    .select("friends pendingRequests");
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

exports.updateUserInfo = expressAsyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true }
  )
    .populate({
      path: "sentRequests",
      select: "name avatarColor _id profilePic",
    })
    .populate({
      path: "pendingRequests",
      select: "name avatarColor _id profilePic",
    })
    .populate({
      path: "friends",
      select: "name avatarColor _id profilePic",
    })
    .select("-password");
  res.status(200).json(user);
});
