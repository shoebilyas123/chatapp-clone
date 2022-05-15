const User = require("../models/user.model");
const { verifyToken } = require("../utils/auth");
const { expressAsyncHandler } = require("../utils/expressAsyncHandler");

exports.protect = expressAsyncHandler(async (req, res, next) => {
  let token = null;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[0] === "Bearer"
  ) {
    token = req.headers["authorization"].split(" ")[1];

    const { id, iat, exp } = verifyToken(token);

    if (Date.now() - iat * 1000 > exp) {
      res.status(401).json({
        status: "fail",
        error: "Your session has expired. Please log in again.",
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res
        .status(401)
        .json({
          status: "fail",
          error: "User has either been deleted or does not exist",
        });
      return;
    }

    req.user = user;
    next();
  } else {
    res.status(401).json({ status: "fail", error: "Not authorized" });
  }
});
