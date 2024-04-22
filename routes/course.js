const router = require("express").Router();
const {
    getCourse
} = require("../controllers/course.controller");


router.get("/", getCourse);

module.exports = router;