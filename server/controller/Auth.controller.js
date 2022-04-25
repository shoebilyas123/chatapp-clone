const { signToken } = require("../utils/auth");
const User = require("./../models/user.model");

exports.register = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name, email and password are mandatory" });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists. Please log in." });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      profilePic: profilePic || "",
    });
    const accessToken = signToken(newUser._id);
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      profilePic: newUser.profilePic,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ messag: "User has either been deleted or does not exist." });
      return;
    }
    const isPasswordValid = await user.isPasswordValid(user.password, password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Please provide a correct password." });
      return;
    }

    const accessToken = signToken(user._id);
    res.status(201).json({
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
exports.changePassword = async (req, res) => {
  try {
    res.send("hello");
  } catch (error) {
    res.send("error");
  }
};
