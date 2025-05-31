const express = require("express");
const driverController = require("../controllers/driverController");

const router = express.Router();

router.post("/login", driverController.login);
router.post("/logout", driverController.logout);
router.post("/create", driverController.createDriver);
router.get("/all", driverController.getAllDrivers);
router.get("/:id", driverController.getDriverById);
router.get(
  "/driver-delivery-requests/:id",
  driverController.getPendingBookingsForDriver
);
router.get(
  "/delivery-report/:id",
  driverController.getDriverDeliveryReport
);
router.put("/deliver-booking", driverController.deliverBooking);
router.put("/update/:id", driverController.updateDriver);
router.delete("/delete/:id", driverController.deleteDriver);

module.exports = router;
