const CustomerNotification = require("../models_v2/customerNotificationsModel");
const Customer = require("../models_v2/customerModel");
const Notification = require("../models_v2/notificationsModel");

// 📌 Create a Customer Notification
const createCustomerNotification = async (req, res) => {
  try {
    const { customer_id, notification_id } = req.body;

    const newCustomerNotification = await CustomerNotification.create({
      customer_id,
      notification_id,
    });

    res.status(201).json(newCustomerNotification);
  } catch (error) {
    console.error("Error creating customer notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Get All Customer Notifications
const getAllCustomerNotifications = async (req, res) => {
  try {
    const customerId = req.params.id; // Get customer_id from request parameters
    const customerNotifications = await CustomerNotification.findAll({
      include: [
        { model: Customer, attributes: ["full_name", "email"] },
        { model: Notification, attributes: ["title", "message"] },
      ],
        where: { customer_id: customerId }, // Filter by customer_id
      order: [["customer_notification_id", "DESC"]],
    });

    res.json(customerNotifications);
  } catch (error) {
    console.error("Error fetching customer notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Delete Customer Notification
const deleteCustomerNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const customerNotification = await CustomerNotification.findByPk(id);
    if (!customerNotification) {
      return res.status(404).json({ error: "Customer Notification not found" });
    }

    await customerNotification.destroy();
    res.json({ message: "Customer Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCustomerNotification,
  getAllCustomerNotifications,
  deleteCustomerNotification,
};
