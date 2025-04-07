const express = require("express");
const adminController = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", adminController.login);
router.post("/logout", adminAuth, adminController.logout);
router.post("/logout", adminController.logout);
router.get("/requests", adminController.allRequests);
router.get("/total-pending-requests", adminController.countAllRequests);
// router.get("/requests", adminAuth, adminController.allRequests);

module.exports = router;
