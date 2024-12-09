const Tanker = require("../models/tankerModel");

// Create a new tanker
exports.createTanker = async (req, res) => {
  try {
    const { plate_no, availability, tanker_model, capacity } = req.body; // Use plate_no and tanker_model as in model
    const newTanker = await Tanker.create({ plate_no, availability, tanker_model, capacity });
    res.status(201).json(newTanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tankers
exports.getAllTankers = async (req, res) => {
  try {
    const tankers = await Tanker.findAll();
    res.status(200).json(tankers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single tanker by ID
exports.getTankerById = async (req, res) => {
  try {
    const tanker = await Tanker.findByPk(req.params.id);
    if (!tanker) {
      return res.status(404).json({ error: "Tanker not found" });
    }
    res.status(200).json(tanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a tanker by ID
exports.updateTanker = async (req, res) => {
  try {
    const { plate_no, availability, tanker_model, capacity } = req.body; // Use plate_no and tanker_model as in model
    const tanker = await Tanker.findByPk(req.params.id);
    if (!tanker) {
      return res.status(404).json({ error: "Tanker not found" });
    }
    await tanker.update({ plate_no, availability, tanker_model, capacity });
    res.status(200).json(tanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a tanker by ID
exports.deleteTanker = async (req, res) => {
  try {
    const tanker = await Tanker.findByPk(req.params.id);
    if (!tanker) {
      return res.status(404).json({ error: "Tanker not found" });
    }
    await tanker.destroy();
    res.status(200).json({ message: "Tanker deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
