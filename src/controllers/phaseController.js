const { Op } = require("sequelize");
const { Phase } = require("../models_v2/index");
const { sequelize } = require("../config/database.js");

// CREATE reuqest in sequlize for Phase
const createPhase = async (req, res) => {
  try {
    const phase = await Phase.create(req.body);
    res.status(201).json({ phase });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to create phase" });
  }
};

// GET request in sequlize for Phase
const getPhases = async (req, res) => {
  try {
    const phases = await Phase.findAll({
      attributes: ["phase_id", "phase_name"],
    });
    res.status(200).json({ phases });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to fetch phases" });
  }
};

// GET request in sequlize for Phase by ID
const getPhaseById = async (req, res) => {
  const { phase_id } = req.params;
  try {
    const phase = await Phase.findOne({
      where: { phase_id },
      attributes: ["phase_id", "phase_name"],
    });
    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }
    res.status(200).json({ phase });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to fetch phase" });
  }
};

// UPDATE request in sequlize for Phase
const updatePhase = async (req, res) => {
  const { phase_id } = req.params;
  try {
    const [updated] = await Phase.update(req.body, {
      where: { phase_id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Phase not found" });
    }
    res.status(200).json({ message: "Phase updated successfully" });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to update phase" });
  }
};

// DELETE request in sequlize for Phase
const deletePhase = async (req, res) => {
  const { phase_id } = req.params;
  try {
    const deleted = await Phase.destroy({
      where: { phase_id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Phase not found" });
    }
    res.status(200).json({ message: "Phase deleted successfully" });
  } catch (error) {
    // console.error(error); // For debugging
    res.status(500).json({ error: error.message || "Failed to delete phase" });
  }
};

module.exports = {
  createPhase,
  getPhases,
  getPhaseById,
  updatePhase,
  deletePhase,
};
