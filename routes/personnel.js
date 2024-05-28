const router = require("express").Router();
const {
    getSpecificPersonnel,
    getEvent
} = require("../controllers/personnel.controller")

const { uploadFile } = require("../controllers/file.controller")

router.get("/" ,getSpecificPersonnel);
router.get("/event" ,getEvent);
router.post("/file" ,uploadFile);


module.exports = router;