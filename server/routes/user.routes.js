const router = require("express").Router();
const UserController = require("../controller/User.controller");
const { protect } = require("../middleware/auth");

router.get("/", protect, UserController.getAllUsers);
router.post("/invite", protect, UserController.inviteUser);
router.get("/friends", protect, UserController.getFriendsInfo);
router.post("/invite/accept", protect, UserController.acceptInvite);
router.post("/chats/delete-all", protect, UserController.deleteAllChats);

module.exports = router;
