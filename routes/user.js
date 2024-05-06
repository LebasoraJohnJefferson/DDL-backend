const router = require("express").Router();
const {
    getUser
} = require("../controllers/user.controller");


router.get("/", getUser);

module.exports = router;