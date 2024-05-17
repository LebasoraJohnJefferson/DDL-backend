const router = require("express").Router();
const {
    createPersonnel,
    getPersonnel,
    deletePersonnel,
    updatePersonnel,
    importPersonnel
} = require("../controllers/personnel.controller")

router.post("/" ,createPersonnel);
router.get("/" ,getPersonnel);
router.delete("/:userId" ,deletePersonnel);
router.put("/:userId" ,updatePersonnel);
router.post("/importPersonnel",importPersonnel)

module.exports = router;