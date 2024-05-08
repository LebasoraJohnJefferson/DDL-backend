const router = require("express").Router();
const {
    postFaculty,
    getUnassignedFacultyMember,
    getFacultyChart,
    getFaculty,
    deleteFaculty
} = require("../controllers/faculty.controller");
const {isAdmin} = require("../middlewares/checkRole")


router.post("/",isAdmin, postFaculty);
router.get("/getUnassignedFacultyMember",isAdmin, getUnassignedFacultyMember);
router.get("/",getFaculty)
router.delete("/:facultyId",deleteFaculty)
router.get("/chart",getFacultyChart)

module.exports = router;