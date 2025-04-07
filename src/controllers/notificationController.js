const Notification = require("../models_v2/notificationsModel");
const Admin = require("../models_v2/adminModel");
const Customer = require("../models_v2/customerModel");
const CustomerNotification = require("../models_v2/customerNotificationsModel");
const { sequelize } = require("../config/database");

// 📌 Create a Notification
const createNotification = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { title, message, admin_id, customer_id } = req.body;

    // ✅ Step 1: Create Notification inside a transaction
    const newNotification = await Notification.create(
      {
        title,
        message,
        admin_id,
      },
      { transaction: t }
    );

    // ✅ Step 2: Create Customer Notification if customer_id is provided
    if (customer_id) {
      await CustomerNotification.create(
        {
          customer_id,
          notification_id: newNotification.notification_id,
        },
        { transaction: t }
      );
    }

    // ✅ Step 3: Commit transaction if both operations succeed
    await t.commit();

    res.status(201).json({
      message: "Notification created successfully",
      notification: newNotification,
    });
  } catch (error) {
    // ❌ Rollback in case of an error
    await t.rollback();
    console.error("Transaction failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createNotificationForAll = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { title, message, admin_id } = req.body;

    // Step 1: Create the notification
    const newNotification = await Notification.create(
      {
        title,
        message,
        admin_id,
      },
      { transaction: t }
    );

    // Step 2: Get all customer IDs
    const customers = await Customer.findAll({
      attributes: ["customer_id"],
      transaction: t,
    });

    // Step 3: Create CustomerNotification entries for all customers
    const customerNotifications = customers.map((customer) => ({
      customer_id: customer.customer_id,
      notification_id: newNotification.notification_id,
    }));

    await CustomerNotification.bulkCreate(customerNotifications, {
      transaction: t,
    });

    // Step 4: Commit the transaction
    await t.commit();

    res.status(201).json({
      message: "Notification sent to all customers successfully.",
      notification: newNotification,
    });
  } catch (error) {
    await t.rollback();
    console.error("Send to all failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Get All Notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [{ model: Admin, attributes: ["full_name", "email"] }], // Include Admin details
      order: [["created_at", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Get Single Notification
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id, {
      include: [{ model: Admin, attributes: ["full_name", "email"] }],
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Update Notification
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.update({ title, message });

    res.json({ message: "Notification updated successfully", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.destroy();
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createNotification,
  createNotificationForAll,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
