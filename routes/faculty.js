const router = require("express").Router();
const {
    postFaculty,
    getUnassignedFacultyMember,
    getFaculty
} = require("../controllers/faculty.controller");
const {isAdmin} = require("../middlewares/checkRole")


router.post("/",isAdmin, postFaculty);
router.get("/getUnassignedFacultyMember",isAdmin, getUnassignedFacultyMember);
router.get("/",getFaculty)

module.exports = router;