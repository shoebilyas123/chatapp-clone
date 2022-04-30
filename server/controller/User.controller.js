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

    const user = await User.findByIdAndUpdate(to, optionsTo).select(
      "name profilePic avatarColor _id"
    );
    await User.findByIdAndUpdate(req.user._id, optionsFrom);

    res.status(200).json({ sent: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
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
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "something went wrong" });
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
