const express = require("express");
const {
  getPhases,
  getPhaseById,
  createPhase,
  updatePhase,
  deletePhase,
} = require("../controllers/phaseController"); // Updated to import from phaseController

const router = express.Router();

// Prefix all routes with /api/phase
router.get("/", getPhases); // Update this to use '/' instead of '/sensor'
router.get("/:phase_id", getPhaseById); // Update this to use '/' instead of '/sensor'
router.post("/", createPhase); // Update this to use '/' instead of '/sensor'
router.put("/:phase_id", updatePhase); // Update this to use '/' instead of '/sensor'
router.delete("/:phase_id", deletePhase); // Update this to use '/' instead of '/sensor'

module.exports = router;
