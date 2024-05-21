const router = require("express").Router();
const {
    getSpecificStudent,
    getEvent
} = require("../controllers/student.controller")


router.get("/" ,getSpecificStudent);
router.get("/event" ,getEvent);


module.exports = router;