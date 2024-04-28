const router = require("express").Router();
const {
    createEvent,
    getEvent,
    deleteEvent
} = require("../controllers/event.controller")
const {isAdmin} = require("../middlewares/checkRole")

router.post("/" ,isAdmin,createEvent);
router.get("/" ,isAdmin,getEvent);
router.delete("/:eventId",isAdmin,deleteEvent)

module.exports = router;