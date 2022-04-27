const User = require("../models/user.model");
const { isBoolean, isTrue } = require("../utils/generics");

exports.getAllUsers = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { from, to } = req.body;

    const optionsTo = {
      $push: { pendingRequests: from },
    };

    const optionsFrom = {
      $push: { sentRequests: to },
    };

    console.log({ from, to, user: req.user });
    await User.findByIdAndUpdate(to, optionsTo);
    await User.findByIdAndUpdate(req.user._id, optionsFrom);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.getFriendsInfo = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
