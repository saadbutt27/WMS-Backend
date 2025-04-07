// routes/userRouter.js
const express = require("express");
const {
  getSensors,
  getAvailableSensors,
  createSensor,
  updateSensor,
  deleteSensor,
} = require("../controllers/sensorController");

const router = express.Router();

// Prefix all routes with /api/sensor
router.get("/", getSensors); // Update this to use '/' instead of '/sensor'
router.get("/available-sensors", getAvailableSensors); // Update this to use '/' instead of '/sensor'
router.post("/", createSensor); // Update this to use '/' instead of '/sensor'
router.put("/", updateSensor); // Update this to use '/' instead of '/sensor'
router.delete("/", deleteSensor); // Update this to use '/' instead of '/sensor'

module.exports = router;
