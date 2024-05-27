const router = require("express").Router();
const {
    updateUser,
    getLoginUser
} = require("../controllers/user.controller");


router.put("/", updateUser);
router.get("/",getLoginUser)

module.exports = router;