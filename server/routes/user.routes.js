const router = require("express").Router();
const UserController = require("../controller/User.controller");
const { protect } = require("../middleware/auth");

router.get("/", protect, UserController.getAllUsers);
router.post("/invite", protect, UserController.inviteUser);

module.exports = router;