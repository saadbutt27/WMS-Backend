const express = require("express");
const customerController = require("../controllers/customerController");

const router = express.Router();

// get the customer details for the home page
router.get("/", customerController.getCustomerDetails);

router.get("/customer-profile", customerController.getCustomerProfile);
router.get("/total-users", customerController.getTotalCustomer);

router.get("/customer-details", customerController.getCustomerDetails);
router.put("/update", customerController.updateCustomer);
router.delete("/delete", customerController.deleteCustomer);

module.exports = router;
