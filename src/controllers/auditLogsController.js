const Auditlog = require("../models_v2/auditLogsModel");

// const { sequelize } = require("../config/database.js");

exports.getAuditLogs = async (req, res) => {
  try {
    const auditLogs = await Auditlog.findAll({});
    res.status(200).json(auditLogs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: error.message });
  }
};
