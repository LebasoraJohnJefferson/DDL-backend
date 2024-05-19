const router = require("express").Router();
const {
    getSpecificPersonnel
} = require("../controllers/personnel.controller")


router.get("/" ,getSpecificPersonnel);


module.exports = router;