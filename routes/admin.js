const router = require("express").Router();
const {
    getAdmin,
    getAllOwner,
    getAllFilesByOwnerId
} = require("../controllers/admin.controller")


router.get("/" ,getAdmin);
router.get("/files/owners",getAllOwner)
router.get("/files/owners/:ownerId",getAllFilesByOwnerId)


module.exports = router;