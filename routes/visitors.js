const router = require("express").Router();
const { getBaelChart } = require("../controllers/baelStudentChart.controller")
const { getBsfChart } = require("../controllers/bsfStudentChart.controller")
const { getFacultyChart } = require("../controllers/faculty.controller")
const { publicEvents,publicImages } = require("../controllers/event.controller")

router.get("/getBaelChart", getBaelChart);
router.get("/getBsfChart", getBsfChart);
router.get("/getFacultyChart", getFacultyChart);
router.get("/publicEvents", publicEvents);
router.get("/publicImages", publicImages);


module.exports = router;