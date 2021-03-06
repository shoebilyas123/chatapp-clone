const router = require("express").Router();
const AuthController = require("../controller/Auth.controller");
const { protect } = require("../middleware/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/my-info", protect, AuthController.getCurrentUser);
router.post("/password-change", protect, AuthController.changePassword);
router.post("/profile-pic", protect, AuthController.updateProfilePic);
router.put("/profile-pic/remove", protect, AuthController.removeProfilePic);
router.get("/chats/:id", protect, AuthController.getChatsFor);
router.post("/friends/remove", protect, AuthController.removeFriend);
router.post("/update", protect, AuthController.updateUserInfo);

module.exports = router;
