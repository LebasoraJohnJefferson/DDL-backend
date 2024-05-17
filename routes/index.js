const router = require("express").Router();

const {verifyToken} = require("../middlewares/generateToken")
const {isAdmin} = require("../middlewares/checkRole")

const Auth = require("./auth")
const Admin = require("./admin")
const AdminControlPersonnel = require("./adminControlPersonnel")
const AdminControlStudent = require("./adminControlStudent")
const Course = require("./course")
const Event = require("./eventControlAdmin")
const User = require("./user")
const Faculty = require("./faculty")
const BaelChart = require("./baelStudentChart")
const bsfChart = require("./bsfStudentChart")
const visitors = require("./visitors")


router.use("/auth",Auth);
router.use("/course",verifyToken,isAdmin,Course)
router.use("/admin",verifyToken, Admin);
router.use("/admin/personnel",verifyToken,isAdmin,AdminControlPersonnel)
router.use("/admin/student",verifyToken,isAdmin,AdminControlStudent)
router.use("/admin/event",verifyToken,isAdmin,Event)
router.use("/admin/users",verifyToken,isAdmin,User)
router.use("/admin/faculty",verifyToken,isAdmin,Faculty)
router.use("/admin/baelChart",verifyToken,isAdmin,BaelChart)
router.use("/admin/bsfChart",verifyToken,isAdmin,bsfChart)
router.use("/",visitors)

module.exports = router;