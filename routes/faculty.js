const router = require("express").Router();
const {
    postFaculty,
    getUnassignedFacultyMember
} = require("../controllers/faculty.controller");


router.post("/", postFaculty);
router.get("/getUnassignedFacultyMember", getUnassignedFacultyMember);

module.exports = router;