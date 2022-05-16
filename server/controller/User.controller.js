const User = require("../models/user.model");
const { expressAsyncHandler } = require("../utils/expressAsyncHandler");
const { isBoolean, isTrue } = require("../utils/generics");
const { getS3SignedURL } = require("../utils/s3");
const { createRoom } = require("../utils/socket");

exports.getAllUsers = expressAsyncHandler(async (req, res) => {
  const searchTerm = req.query.search;
  const forFR = req.query.forFR;

  const options = {
    email: { $ne: req.user.email },
    ...(searchTerm && { name: new RegExp(searchTerm, "g") }),
    ...(isBoolean(forFR) &&
      isTrue(forFR) && { pendingRequests: { $nin: [req.user._id] } }),
  };

  const users = await User.find(options).select("-password");

  res.status(200).json(users);
});

exports.inviteUser = expressAsyncHandler(async (req, res) => {
  const { from, to } = req.body;

  const optionsTo = {
    $push: { pendingRequests: from },
  };

  const optionsFrom = {
    $push: { sentRequests: to },
  };

  const user = await User.findByIdAndUpdate(to, optionsTo).select(
    "name profilePic avatarColor _id"
  );
  await User.findByIdAndUpdate(req.user._id, optionsFrom);

  res.status(200).json({ sent: user });
});

exports.acceptInvite = expressAsyncHandler(async (req, res) => {
  const { acceptId } = req.body;

  const options = {
    $push: { friends: acceptId },
    $pull: { pendingRequests: acceptId },
  };
  const user = await User.findByIdAndUpdate(req.user._id, options)
    .populate({ path: "friends", select: "_id name profilePic avatarColor" })
    .select("friends pendingRequests");
  await User.findByIdAndUpdate(acceptId, {
    $push: { friends: req.user._id },
    $pull: { sentRequests: req.user._id },
  });

  res
    .status(200)
    .json({ friends: user.friends, pendingRequests: user.pendingRequests });
});

exports.getFriendsInfo = expressAsyncHandler(async (req, res) => {
  const friendsInfo = await User.findById(req.user._id)
    .populate({
      path: "pendingRequests",
      select: "name profilePic _id avatarColor",
    })
    .populate({
      path: "sentRequests",
      select: "name profilePic _id avatarColor",
    })
    .select("pendingRequests sentRequests");

  res.status(200).json(friendsInfo);
});

exports.deleteAllChats = expressAsyncHandler(async (req, res) => {
  const { to } = req.body;

  const roomKey = createRoom(req.user._id, to);
  const chatUpdateOptions = {
    $pull: { chatHistory: { room: { $in: [roomKey] } } },
  };
  await User.findByIdAndUpdate(req.user._id, chatUpdateOptions, {
    new: true,
  });
  res
    .status(200)
    .json({ status: "success", message: "Chats deleted successfully" });
});

exports.uploadProfilePic = expressAsyncHandler(async (req, res) => {
  const fileName = req.query.fileName;
  const fileType = req.query.fileType.split("/")[1];
  console.log({ fileType });
  const url = await getS3SignedURL(fileName, fileType, req.user._id);
  res.status(200).json({ url });
});

exports.getUser = expressAsyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  res.status(200).json({ user });
});
