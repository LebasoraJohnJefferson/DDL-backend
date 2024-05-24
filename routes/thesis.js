const router = require("express").Router();
const {
    createThesis,
    getThesis,
    deleteThesis
} = require("../controllers/thesis.controller")


router.post("/" ,createThesis);
router.get("/" ,getThesis);
router.delete("/:thesisId" ,deleteThesis);


module.exports = router;