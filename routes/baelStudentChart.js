const router = require("express").Router();
const {verifyToken} = require("../middlewares/generateToken")
const {
    createStudentChart,
    getStudentOrg,
    deleteStudentOrgMember
} = require("../controllers/baelStudentChart.controller");
const {isAdmin} = require("../middlewares/checkRole")


router.post("/", verifyToken,isAdmin,createStudentChart);
router.delete("/:userId", verifyToken,isAdmin,deleteStudentOrgMember);
router.get("/", verifyToken,isAdmin,getStudentOrg);

module.exports = router;