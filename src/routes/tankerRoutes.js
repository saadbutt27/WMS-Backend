const express = require("express");
const tankerController = require("../controllers/tankerController");

const router = express.Router();

// Create a new tanker
router.post("/", tankerController.createTanker);

// Get all tankers
router.get("/", tankerController.getAllTankers);

// Get a single tanker by ID
router.get("/:id", tankerController.getTankerById);

// Update a tanker by ID
router.put("/:id", tankerController.updateTanker);

// Delete a tanker by ID
router.delete("/:id", tankerController.deleteTanker);

module.exports = router;
