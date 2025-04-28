const express = require("express");
const auditLogsController = require("../controllers/auditLogsController");

const router = express.Router();

router.get("/get-audit-logs", auditLogsController.getAuditLogs);

module.exports = router;
