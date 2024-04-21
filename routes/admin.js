const router = require("express").Router();
const {
    getAdmin
} = require("../controllers/admin.controller")


router.get("/" ,getAdmin);


module.exports = router;