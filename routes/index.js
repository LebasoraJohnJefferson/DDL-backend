const router = require("express").Router();
const Auth = require("./auth")
const Admin = require("./admin")
const {verifyToken} = require("../middlewares/generateToken")

router.use("/auth",Auth);
router.use("/admin",verifyToken, Admin);

module.exports = router;