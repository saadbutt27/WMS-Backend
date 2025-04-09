const express = require("express");
const router = express.Router();
const complainController = require("../controllers/complainController");

router.post("/create-complain", complainController.createComplain);
router.put(
  "/update-complain-remarks/:id",
  complainController.updateComplainByAdmin
);

router.get("/all-complains", complainController.getAllComplains);
router.get("/single-complain/:id", complainController.getComplainById);

// router.patch("/update-complain/:id", complainController.updateComplain);
router.delete("/delete-complain/:id", complainController.deleteComplain);

router.get("/customer/:id", complainController.getComplainsByCustomer);
router.get(
  "/admin/:admin_id/resolved",
  complainController.getResolvedComplainsByAdmin
);
router.get("/unresolved", complainController.getUnresolvedComplains);
router.get("/resolved", complainController.getResolvedComplains);

module.exports = router;
