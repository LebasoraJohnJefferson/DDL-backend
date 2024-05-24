const router = require("express").Router();
const {
    createThesis,
    getThesis,
    deleteThesis,
    updateThesis
} = require("../controllers/thesis.controller")


router.post("/" ,createThesis);
router.get("/" ,getThesis);
router.delete("/:thesisId" ,deleteThesis);
router.put("/:thesisId" ,updateThesis);

module.exports = router;