const router = require("express").Router();
const {verifyToken} = require("../middlewares/generateToken")
const {
    createStudentChart,
    getStudentOrg,
    deleteStudentOrgMember,
    getStudentWithNoRole
} = require("../controllers/bsfStudentChart.controller");
const {isAdmin} = require("../middlewares/checkRole")


router.post("/", verifyToken,isAdmin,createStudentChart);
router.get("/getUnassignedBAELStudent", verifyToken,isAdmin,getStudentWithNoRole);
router.get("/", verifyToken,isAdmin,getStudentOrg);
router.delete("/:userId", verifyToken,isAdmin,deleteStudentOrgMember);

module.exports = router;