const router = require("express").Router();
const {
    updateUser,
} = require("../controllers/user.controller");


router.put("/", updateUser);

module.exports = router;