const router = require("express").Router();

const {
    getThesis,
    getSpecificThesis
} = require("../controllers/thesis.controller")


router.get("/personnel", getThesis);
router.get("/personnel/:thesisId", getSpecificThesis);


module.exports = router;