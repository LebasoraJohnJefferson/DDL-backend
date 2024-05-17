const router = require("express").Router();
const {
    createEvent,
    getEvent,
    deleteEvent
} = require("../controllers/event.controller")

router.post("/" ,createEvent);
router.get("/" ,getEvent);
router.delete("/:eventId",deleteEvent)

module.exports = router;