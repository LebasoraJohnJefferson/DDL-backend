const router = require("express").Router();
const {
    createStudentChart,
    getStudentOrg,
    deleteStudentOrgMember,
    getStudentWithNoRole,
    getBaelChart
} = require("../controllers/baelStudentChart.controller");
// const {isAdmin} = require("../middlewares/checkRole")
// const {verifyToken} = require("../middlewares/generateToken")



router.get("/chart",getBaelChart);
router.post("/",createStudentChart);
router.get("/getUnassignedBAELStudent",getStudentWithNoRole);
router.get("/",getStudentOrg);
router.delete("/:userId",deleteStudentOrgMember);

module.exports = router;