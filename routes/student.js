const router = require("express").Router();
const {
    createStudent,
    getStudent,
    deleteStudent,
    updateStudent,
    importStudent
} = require("../controllers/student.controller")
const {isAdmin} = require("../middlewares/checkRole")

router.post("/" ,isAdmin,createStudent);
router.get("/" ,isAdmin,getStudent);
router.delete("/:userId" ,isAdmin,deleteStudent);
router.put("/:userId" ,isAdmin,updateStudent);
router.post("/importStudent",isAdmin,importStudent)

module.exports = router;