const router = require("express").Router();
const {
    getSpecificPersonnel,
    getEvent
} = require("../controllers/personnel.controller")

const { uploadFile,getOwnerFile,deleteFile } = require("../controllers/file.controller")

router.get("/" ,getSpecificPersonnel);
router.get("/event" ,getEvent);
router.get("/file/getOwnerFile" ,getOwnerFile);
router.post("/file" ,uploadFile);
router.delete("/file/:fileId" ,deleteFile);


module.exports = router;