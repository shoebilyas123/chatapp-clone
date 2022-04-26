const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const options = {
      email: { $ne: req.user.email },
      ...(searchTerm && { name: new RegExp(searchTerm, "g") }),
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
      $push: { sentRequests: { to } },
    };

    console.log({ from, to, user: req.user });
    await User.findByIdAndUpdate(to, optionsTo);
    await User.findByIdAndUpdate(req.user._id, optionsFrom);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
