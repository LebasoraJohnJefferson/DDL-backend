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


router.use("/auth",Auth);
router.use("/course",verifyToken,Course)
router.use("/admin",verifyToken,isAdmin, Admin);
router.use("/admin/personnel",verifyToken,AdminControlPersonnel)
router.use("/admin/student",verifyToken,AdminControlStudent)
router.use("/admin/event",verifyToken,Event)
router.use("/admin/users",verifyToken,User)
router.use("/admin/faculty",verifyToken,Faculty)
router.use("/admin/baelChart",BaelChart)
router.use("/admin/bsfChart",bsfChart)

module.exports = router;