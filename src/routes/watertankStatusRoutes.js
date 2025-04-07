// routes/userRouter.js
const express = require("express");
const {
  createTankStatus,
  getTankStatus,
  getDailyAvgConsumption,
} = require("../controllers/waterTankStatusController");

const router = express.Router();

router.get("/water-level", createTankStatus);
router.get("/latest-water-level", getTankStatus);
router.get("/daily-avg-consumption", getDailyAvgConsumption);

module.exports = router;
