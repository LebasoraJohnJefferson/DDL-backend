const router = require("express").Router();
const {
    createPersonnel
} = require("../controllers/personnel.controller")
const {isAdmin} = require("../middlewares/checkRole")

router.post("/" ,isAdmin,createPersonnel);


module.exports = router;