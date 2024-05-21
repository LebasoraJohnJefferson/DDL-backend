const router = require("express").Router();
const {
    getSpecificPersonnel,
    getEvent
} = require("../controllers/personnel.controller")


router.get("/" ,getSpecificPersonnel);
router.get("/event" ,getEvent);


module.exports = router;