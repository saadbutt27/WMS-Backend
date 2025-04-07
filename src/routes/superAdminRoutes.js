const express = require("express");
const superAdminController = require("../controllers/superAdminController");
const { superAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", superAdminController.login);
router.post("/logout", superAdminController.logout);
// router.post("/logout", superAdminAuth, superAdminController.logout);
router.post("/create-admin", superAdminController.createAdmin);
// router.post("/create-admin", superAdminAuth, superAdminController.createAdmin);
router.get("/view-admins", superAdminController.getAllAdmins);
router.put("/update-admin", superAdminController.updateAdmin);
router.delete("/delete-admin", superAdminController.deleteAdmin);

module.exports = router;
