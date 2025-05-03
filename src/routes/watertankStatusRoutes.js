// routes/userRouter.js
const express = require("express");
const {
  createTankStatus,
  getTankStatus,
  getTankStatusGallons,
  getDailyAvgConsumption,
  getTankStatusWithConsumption,
} = require("../controllers/waterTankStatusController");

const router = express.Router();

router.get("/water-level", createTankStatus);
router.get("/latest-water-level", getTankStatus);
router.get("/latest-water-level-gallons", getTankStatusGallons);
router.get("/daily-avg-consumption", getDailyAvgConsumption);
router.get("/hourly-tank-status", getTankStatusWithConsumption);

module.exports = router;
