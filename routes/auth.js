const router = require("express").Router();
const { resetToken } = require("../middlewares/generateToken");
const {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword
} = require("../controllers/auth.controller");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetToken,resetPassword)


module.exports = router;