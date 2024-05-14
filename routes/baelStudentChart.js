const router = require("express").Router();
const {verifyToken} = require("../middlewares/generateToken")
const {
    createStudentChart,
    getStudentOrg,
    deleteStudentOrgMember,
    getStudentWithNoRole,
    getBaelChart
} = require("../controllers/baelStudentChart.controller");
const {isAdmin} = require("../middlewares/checkRole")


router.post("/", verifyToken,isAdmin,createStudentChart);
router.get("/getUnassignedBAELStudent", verifyToken,isAdmin,getStudentWithNoRole);
router.get("/chart", verifyToken,isAdmin,getBaelChart);
router.get("/", verifyToken,isAdmin,getStudentOrg);
router.delete("/:userId", verifyToken,isAdmin,deleteStudentOrgMember);

module.exports = router;