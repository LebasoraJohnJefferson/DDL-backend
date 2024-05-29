const router = require("express").Router();
const {
    getSpecificPersonnel,
    getEvent,
    getCoWorker,
    sharedFile,
    getInviteCoWorker,
    removeInvitation,
    getUserWhoInvitedTheAuthUser,
    getSharedFiles
} = require("../controllers/personnel.controller")

const { uploadFile,getOwnerFile,deleteFile } = require("../controllers/file.controller")

router.get("/" ,getSpecificPersonnel);
router.get("/getCoWorker/:fileId" ,getCoWorker);
router.get("/getInviteCoWorker/:fileId" ,getInviteCoWorker);
router.get("/event" ,getEvent);
router.post("/sharedFile" ,sharedFile);
router.post("/file" ,uploadFile);
router.get("/file/getSharedFile/:userId" ,getSharedFiles);
router.get("/file/getUserWhoInvitedTheAuthUser" ,getUserWhoInvitedTheAuthUser);
router.get("/file/getOwnerFile" ,getOwnerFile);
router.delete("/file/removeInvitation/:invitationId" ,removeInvitation);
router.delete("/file/:fileId" ,deleteFile);


module.exports = router;