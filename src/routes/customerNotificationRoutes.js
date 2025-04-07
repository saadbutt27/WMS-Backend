const express = require("express");
const router = express.Router();
const {
  createCustomerNotification,
  getAllCustomerNotifications,
  deleteCustomerNotification,
} = require("../controllers/customerNotificationController");

// router.post("/", createCustomerNotification);
router.get("/all-notifications/:id", getAllCustomerNotifications);
// router.delete("/:id", deleteCustomerNotification);

module.exports = router;
