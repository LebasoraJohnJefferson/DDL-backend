const router = require("express").Router();
const {verifyToken} = require("../middlewares/generateToken")
const {
    createStudentChart
} = require("../controllers/baelStudentChart.controller");
const {isAdmin} = require("../middlewares/checkRole")


router.post("/", verifyToken,isAdmin,createStudentChart);

module.exports = router;