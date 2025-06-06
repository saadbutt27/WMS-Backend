const express = require("express");
const tankerController = require("../controllers/tankerController");
// const {adminAuth} = require("../middlewares/authMiddleware");

const router = express.Router();

// request a tanker
router.post("/request-tanker", tankerController.requestTanker);
router.get("/request-tanker", tankerController.getAllRequests);

// Create a new tanker
router.post("/", tankerController.createTanker);
// Create tanker_phase_relationship
// router.post("/tanker-phase", tankerController.createTankerPhase);

// Get all tankers
router.get("/", tankerController.getAllTankers);
router.get("/total-tankers", tankerController.getTotalTankers);
router.get("/available-tankers", tankerController.getAvailabletankers);
router.get("/tankers_phasewise/:id", tankerController.getAvailabletankersPhaseWise);

// Get a single tanker by ID
router.get("/:id", tankerController.getTankerById);

// Update a tanker by ID
router.put("/:id", tankerController.updateTanker);

// Delete a tanker by ID
router.delete("/:id", tankerController.deleteTanker);

module.exports = router;
