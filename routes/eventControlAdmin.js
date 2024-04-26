const router = require("express").Router();
const {
    createEvent,
    getEvent
} = require("../controllers/event.controller")
const {isAdmin} = require("../middlewares/checkRole")

router.post("/" ,isAdmin,createEvent);
router.get("/" ,isAdmin,getEvent);

module.exports = router;