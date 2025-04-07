const express = require("express");
const router = express.Router();
const {
  createNotification,
  createNotificationForAll,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController");

router.post("/create-notification", createNotification);
router.post("/create-notification-for-all", createNotificationForAll);
router.get("/all-notifications", getAllNotifications);
router.get("/single-notification/:id", getNotificationById);
router.put("/update-notification/:id", updateNotification);
router.delete("/delete-notification/:id", deleteNotification);

module.exports = router;
