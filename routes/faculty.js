const router = require("express").Router();
const {
    postFaculty,
    getUnassignedFacultyMember,
    getFacultyChart,
    getFaculty,
    deleteFaculty
} = require("../controllers/faculty.controller");


router.post("/", postFaculty);
router.get("/getUnassignedFacultyMember", getUnassignedFacultyMember);
router.get("/",getFaculty)
router.delete("/:facultyId",deleteFaculty)
router.get("/chart",getFacultyChart)

module.exports = router;