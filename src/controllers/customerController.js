const { Op } = require("sequelize");
const {
  WaterTank,
  WaterTankStatus,
  Request,
  Customer,
  Sensor,
} = require("../models_v2/index");
const { sequelize } = require("../config/database.js");
const bcrypt = require("bcrypt");

// Fetch customer details
exports.getCustomerDetails = async (req, res) => {
  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ message: "Customer ID is required." });
  }

  try {
    // Get water tank & customer info
    const waterTank = await WaterTank.findOne({
      where: { customer_id },
      attributes: ["tank_id", "capacity"],
      include: [{ model: Customer, attributes: ["full_name"] }],
    });

    if (!waterTank) {
      return res
        .status(404)
        .json({ message: "No data found for the customer" });
    }

    // console.log("waterTank", waterTank);

    // Get latest tank status
    const latestStatus = await WaterTankStatus.findOne({
      where: { tank_id: waterTank.tank_id },
      attributes: ["water_level", "status_date"],
      order: [["status_date", "DESC"]],
    });

    // console.log("latestStatus", latestStatus);

    let waterLevelPercentage = null;
    let waterLevelInLiters = null;
    // let consumptionDifference = 0;
    let lastRequest = null;
    let expectedToLastUntil = null;

    if (latestStatus) {
      waterLevelInLiters = latestStatus.water_level;
      waterLevelPercentage = (waterLevelInLiters / waterTank.capacity) * 100;
    }
    // console.log("waterLevelInLiters", waterLevelInLiters);
    // console.log("waterLevelPercentage", waterLevelPercentage);

    // Get last order
    lastRequest = await Request.findOne({
      where: { customer_id },
      order: [["request_date", "DESC"]],
    });
    // console.log("lastRequest", lastRequest);

    // Calculate expected duration
    if (lastRequest) {
      const avgDailyConsumption = 200; // better to move this to a config
      const durationMs =
        (lastRequest.requested_liters / avgDailyConsumption) *
        24 *
        60 *
        60 *
        1000;
      expectedToLastUntil = new Date(
        lastRequest.request_date.getTime() + durationMs
      );
    }

    // Water consumption in last 24 hours
    // const statuses = await WaterTankStatus.findAll({
    //   where: {
    //     tank_id: waterTank.tank_id,
    //     status_date: {
    //       [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
    //     },
    //   },
    //   order: [["status_date", "ASC"]],
    // });
    // console.log("statuses", statuses);

    // if (statuses.length >= 2) {
    //   const firstStatus = statuses[0];
    //   const lastStatus = statuses[statuses.length - 1];
    //   consumptionDifference = firstStatus.water_level - lastStatus.water_level;
    // }

    // Response
    const response = {
      username: waterTank.Customer.full_name,
      tank_id: waterTank.tank_id,
      water_level_percentage: waterLevelPercentage?.toFixed(2) || null,
      water_level_liters: waterLevelInLiters,
      last_order_date: lastRequest ? lastRequest.request_date : null,
      expected_to_last_until: expectedToLastUntil,
      // water_consumption_last_24_hours: consumptionDifference,
      capacity: waterTank.capacity,
      current_gallons: waterTank.capacity * waterLevelPercentage,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving tank details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching tank details." });
  }
};

exports.getCustomerProfile = async (req, res) => {
  const { customer_id } = req.query;

  try {
    // Fetch customer profile from the database using the customer_id
    const customerWithLatestTankStatus = await Customer.findOne({
      where: { customer_id: customer_id },
      attributes: [
        "customer_id",
        "full_name",
        "email",
        "phone_number",
        "home_address",
        "username",
        "balance",
        "password",
        "created_at",
      ],
      include: [
        {
          model: WaterTank,
          attributes: ["tank_id", "sensor_id"],
          required: false,
          include: [
            {
              model: WaterTankStatus,
              attributes: ["water_level", "status_date"],
              required: false,
              limit: 1,
              separate: true, // ensures LIMIT 1 applies to status only, not the whole join
              order: [["status_date", "DESC"]],
            },
          ],
        },
      ],
    });

    // const customerProfile = {
    //   customerWithLatestTankStatus,
    // };

    // Check if customer exists
    if (!customerWithLatestTankStatus) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Return the customer profile
    res.status(200).json(customerWithLatestTankStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve customer profile." });
  }
};

exports.getTotalCustomer = async (req, res) => {
  try {
    // Fetch customer profile from the database using the customer_id
    const totalUsers = await Customer.count();
    // Return the customer profile
    res.status(200).json({ total_users: totalUsers });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCustomer = async (req, res) => {
  const {
    customer_id,
    full_name,
    email,
    phone_number,
    home_address,
    username,
    password,
    tank_capacity,
    balance,
    device_id,
  } = req.body;

  const t = await sequelize.transaction(); // start transaction

  try {
    // Check if email is used by someone else
    const existingCustomer = await Customer.findOne({
      where: {
        email,
        customer_id: { [Op.ne]: customer_id }, // Not the same customer
      },
      transaction: t,
    });

    if (existingCustomer) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Email already in use by another customer." });
    }

    // Prepare update data
    let updateData = {
      full_name,
      email,
      phone_number,
      home_address,
      username,
      balance,
    };

    // Hash password only if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const customerUpdate = await Customer.update(updateData, {
      where: { customer_id },
      transaction: t,
    });

    if (customerUpdate[0] === 0) {
      throw new Error("Customer not found for update.");
    }

    // update water tank
    const wat = await WaterTank.update(
      {
        capacity: tank_capacity,
        sensor_id: device_id,
      },
      {
        where: { customer_id },
        transaction: t,
      }
    );
    if (wat[0] === 0) {
      throw new Error("No water tank found for the customer.");
    }

    // console.log(wat);

    // Commit transaction if both succeed
    await t.commit();

    res.status(200).json({
      message: "Update successful.",
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  const customer_id = req.query.customer_id; // Change here 👈
  const t = await sequelize.transaction();
  try {
    // find the sensor id, assigned to this customer, the sensor id in water tanks table which is connected to customer table
    const sensor_id = await WaterTank.findOne({
      where: { customer_id },
      attributes: ["sensor_id"],
      transaction: t,
    });
    // Delete the customer
    await Customer.destroy(
      {
        where: { customer_id },
      },
      {
        transaction: t,
      }
    );
    // Delete the water tank
    // const waterTank = await WaterTank.destroy(
    //   {
    //     where: { customer_id: customer_id },
    //   },
    //   {
    //     transaction: t,
    //   }
    // );
    // Update that sensor status to Not ssigned
    await Sensor.update(
      {
        status: "Not Assigned",
      },
      {
        where: { sensor_id: sensor_id.sensor_id },
        transaction: t,
      }
    );

    // Commit transaction if both operations succeed
    await t.commit();
    res.status(200).json({ message: "Delete successful." });
  } catch (error) {
    console.error(error);
    // Rollback transaction on error
    await t.rollback();
    res.status(500).json({ error: "Delete failed." });
  }
};
