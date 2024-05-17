const router = require("express").Router();
const {
    createStudent,
    getStudent,
    deleteStudent,
    updateStudent,
    importStudent
} = require("../controllers/student.controller")

router.post("/" ,createStudent);
router.get("/" ,getStudent);
router.delete("/:userId" ,deleteStudent);
router.put("/:userId" ,updateStudent);
router.post("/importStudent",importStudent)

module.exports = router;