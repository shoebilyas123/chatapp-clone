const User = require("../models/user.model");
const { verifyToken } = require("../utils/auth");

exports.protect = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[0] === "Bearer"
    ) {
      token = req.headers["authorization"].split(" ")[1];

      const { id, iat, exp } = verifyToken(token);

      if (Date.now() - iat * 1000 > exp) {
        res
          .status(401)
          .json({ message: "Your session has expired. Please log in again." });
        return;
      }

      const user = await User.findById(id);
      if (!user) {
        res
          .status(401)
          .json({ message: "User has either been deleted or does not exist" });
        return;
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
