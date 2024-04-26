const router = require("express").Router();
const {
    createPersonnel,
    getPersonnel,
    deletePersonnel,
    updatePersonnel,
    importPersonnel
} = require("../controllers/personnel.controller")
const {isAdmin} = require("../middlewares/checkRole")

router.post("/" ,isAdmin,createPersonnel);
router.get("/" ,isAdmin,getPersonnel);
router.delete("/:userId" ,isAdmin,deletePersonnel);
router.put("/:userId" ,isAdmin,updatePersonnel);
router.post("/importPersonnel",isAdmin,importPersonnel)

module.exports = router;