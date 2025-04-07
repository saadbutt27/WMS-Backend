const { Complain, Customer, Admin } = require("../models_v2/index");
const { sequelize } = require("../config/database");

// ✅ Create a new complain, by customer
exports.createComplain = async (req, res) => {
  try {
    const { complain_description, customer_id } = req.body;

    const newComplain = await Complain.create({
      complain_description,
      customer_id,
    });

    res.status(201).json({
      message: "Complain created successfully",
      complain: newComplain,
    });
  } catch (error) {
    console.error("Error creating complain:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateComplainByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, admin_id } = req.body;

    const complain = await Complain.findByPk(id);
    if (!complain) {
      return res.status(404).json({ message: "Complain not found" });
    }

    await complain.update({ remarks, admin_id, status: "Resolved" });
    res.json({ message: "Complain updated successfully", complain });
  } catch (error) {
    console.error("Error updating complain:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all complains
exports.getAllComplains = async (req, res) => {
  try {
    const complains = await Complain.findAll({
      include: [
        { model: Customer, attributes: ["full_name"] },
        { model: Admin, attributes: ["full_name"] },
      ],
    });
    res.json(complains);
  } catch (error) {
    console.error("Error fetching complains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get a complain by ID
exports.getComplainById = async (req, res) => {
  try {
    const { id } = req.params;
    const complain = await Complain.findByPk(id, {
      include: [
        { model: Customer, attributes: ["full_name"] },
        { model: Admin, attributes: ["full_name"] },
      ],
    });

    if (!complain) {
      return res.status(404).json({ message: "Complain not found" });
    }

    res.json(complain);
  } catch (error) {
    console.error("Error fetching complain:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update a complain
exports.updateComplain = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const complain = await Complain.findByPk(id);
    if (!complain) {
      return res.status(404).json({ message: "Complain not found" });
    }

    await complain.update(updates);
    res.json({ message: "Complain updated successfully", complain });
  } catch (error) {
    console.error("Error updating complain:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete a complain
exports.deleteComplain = async (req, res) => {
  try {
    const { id } = req.params;

    const complain = await Complain.findByPk(id);
    if (!complain) {
      return res.status(404).json({ message: "Complain not found" });
    }

    await complain.destroy();
    res.json({ message: "Complain deleted successfully" });
  } catch (error) {
    console.error("Error deleting complain:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all complains for a specific customer
exports.getComplainsByCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const complains = await Complain.findAll({
      where: { customer_id: id },
      include: [
        { model: Customer, attributes: ["full_name"] },
        { model: Admin, attributes: ["full_name"] },
      ],
    });

    res.json(complains);
  } catch (error) {
    console.error("Error fetching customer complains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all resolved complains handled by a specific admin
exports.getResolvedComplainsByAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const resolvedComplains = await Complain.findAll({
      where: {
        admin_id,
        status: "Resolved",
      },
      include: [
        { model: Customer, attributes: ["full_name"] },
        { model: Admin, attributes: ["full_name"] },
      ],
    });

    res.json(resolvedComplains);
  } catch (error) {
    console.error("Error fetching resolved complains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all unresolved complains
exports.getUnresolvedComplains = async (req, res) => {
  try {
    const unresolvedComplains = await Complain.findAll({
      where: { status: "Pending" },
      include: [
        { model: Customer, attributes: ["full_name"] },
        { model: Admin, attributes: ["full_name"] },
      ],
    });
    res.json(unresolvedComplains);
  } catch (error) {
    console.error("Error fetching unresolved complains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Get all resolved complains
exports.getResolvedComplains = async (req, res) => {
  try {
    const resolvedComplains = await Complain.findAll({
      where: { status: "Resolved" },
    });
    res.json(resolvedComplains);
  } catch (error) {
    console.error("Error fetching resolved complains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
