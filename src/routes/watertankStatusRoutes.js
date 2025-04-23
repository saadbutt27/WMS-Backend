// routes/userRouter.js
const express = require("express");
const {
  createTankStatus,
  getTankStatus,
  getDailyAvgConsumption,
  getTankStatusWithConsumption,
} = require("../controllers/waterTankStatusController");

const router = express.Router();

router.get("/water-level", createTankStatus);
router.get("/latest-water-level", getTankStatus);
router.get("/daily-avg-consumption", getDailyAvgConsumption);
router.get("/hourly-tank-status/:id", getTankStatusWithConsumption);

module.exports = router;
