const router = require("express").Router();
const Auth = require("./auth")
const Admin = require("./admin")
const Personnel = require("./personnel")
const {verifyToken} = require("../middlewares/generateToken")
const {isAdmin} = require("../middlewares/checkRole")
const Course = require("./course")

router.use("/auth",Auth);
router.use("/admin",verifyToken,isAdmin, Admin);
router.use("/personnel",verifyToken,Personnel)
router.use("/course",verifyToken,Course)

module.exports = router;