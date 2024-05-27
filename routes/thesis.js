const router = require("express").Router();
const {
    createThesis,
    getThesis,
    deleteThesis,
    updateThesis,
    importThesis,
    getSpecificThesis
} = require("../controllers/thesis.controller")


router.post("/" ,createThesis);
router.post("/importThesis" ,importThesis);
router.get("/" ,getThesis);
router.get("/:thesisId" ,getSpecificThesis);
router.delete("/:thesisId" ,deleteThesis);
router.put("/:thesisId" ,updateThesis);

module.exports = router;