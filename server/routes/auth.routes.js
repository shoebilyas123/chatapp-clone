const router = require("express").Router();
const AuthController = require("../controller/Auth.controller");
const { protect } = require("../middleware/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/my-info", protect, AuthController.getCurrentUser);
router.post("/password-change", protect, AuthController.changePassword);

module.exports = router;
