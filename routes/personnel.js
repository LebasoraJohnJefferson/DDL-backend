const router = require("express").Router();
const {
    createPersonnel,
    getPersonnel,
    deletePersonnel
} = require("../controllers/personnel.controller")
const {isAdmin} = require("../middlewares/checkRole")

router.post("/" ,isAdmin,createPersonnel);
router.get("/" ,isAdmin,getPersonnel);
router.delete("/:userId" ,isAdmin,deletePersonnel);


module.exports = router;