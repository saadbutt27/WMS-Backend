const { Op } = require("sequelize");
const {
  Bookings,
  Request,
  Customer,
  Tanker,
  Driver,
  UserTypes,
  Phase,
} = require("../models_v2/index"); // Adjust the path to your models

const { sequelize } = require("../config/database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const driver = await Driver.findOne({
      where: { username },
      //   attributes: ["password"],
    });
    // console.log(driver);

    if (!driver) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Verify the password
    // const isPasswordValid = driver.password === password;
    const isPasswordValid = await bcrypt.compare(password, driver.password);
    console.log(driver.password, password, isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign({ driver }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    // Respond with token and customer_id
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Login failed due to a server error.",
    });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful." });
};

exports.createDriver = async (req, res) => {
  const { full_name, email, phone_number, license_number, username, password } =
    req.body;
  // console.log(req.body);
  try {
    // Check if email or username is used by someone else
    const existingDriver = await Driver.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    if (existingDriver) {
      return res.status(400).json({
        status: "error",
        message: "Email/Username already in use by another driver.",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the driver
    const newDriver = await Driver.create({
      full_name,
      email,
      phone_number,
      license_number,
      username,
      password: hashedPassword,
      user_type_id: 3, // Default to 3 for driver
    });
    // Respond with the new driver
    res.status(201).json({
      status: "success",
      data: newDriver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to create driver.",
    });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      // description from userTypes table
      include: [
        {
          model: UserTypes,
          attributes: ["type", "description"],
        },
      ],
    });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverById = async (req, res) => {
  const driver_id = req.params.id;
  try {
    const driver = await Driver.findByPk(driver_id, {
      include: [
        {
          model: UserTypes,
          attributes: ["type", "description"],
        },
      ],
    });
    if (!driver) {
      return res.status(404).json({
        status: "error",
        message: "Driver not found.",
      });
    }
    res.status(200).json({
      status: "success",
      data: driver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// exports.getDeliveriesByDriver = async (req, res) => {
//   try {
//     const driver_id = req.params.id; // Get driver ID from request parameters

//     const deliveries = await DeliverySchedule.findAll({
//       where: { driver_id }, // Filter by driver_id
//       attributes: ["scheduled_date"], // Select scheduled_date from DeliverySchedule
//       include: [
//         {
//           model: Request,
//           attributes: [], // No need to select fields from Request
//           include: [
//             {
//               model: Customer,
//               attributes: ["full_name", "home_address", "phone_number"], // Select customer details
//             },
//           ],
//         },
//       ],
//       raw: true, // Returns plain objects instead of Sequelize instances
//       nest: true, // Nest results properly
//     });

//     res.status(200).json({
//       status: "success",
//       data: deliveries,
//     });
//   } catch (error) {
//     console.error("Error fetching deliveries:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch deliveries.",
//     });
//   }
// };

exports.getPendingBookingsForDriver = async (req, res) => {
  try {
    const driver_id = req.params.id; // Get driver ID from request parameters
    console.log(driver_id);
    const bookings = await Bookings.findAll({
      attributes: ["booking_id", "scheduled_date"],
      include: [
        {
          model: Request,
          attributes: [], // No need to select extra columns from requests
          include: [
            {
              model: Customer,
              attributes: [
                "customer_id",
                "full_name",
                "street_address",
                "phone_number",
              ],
              include: [
                {
                  model: Phase, // <-- Join with Phase table
                  attributes: ["phase_id", "phase_name"], // 
                },
              ],
            },
          ],
        },
        {
          model: Tanker,
          attributes: [], // No need to select extra columns from tankers
          where: {
            assigned_driver_id: driver_id,
          },
        },
      ],
      where: {
        status: "Pending",
      },
      order: [
        ["customer_id", "ASC"], // Ensure customer_id sorting
        ["scheduled_date", "DESC"],
      ],
      raw: true, // Flattens the result for easier access
      nest: true, // Ensures nested results maintain structure
    });

    res.status(200).json({
      status: "success",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch deliveries.",
    });
  }
};

exports.deliverBooking = async (req, res) => {
  const { booking_id, code } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Fetch booking details with customer balance and tanker cost
    const booking = await Bookings.findOne({
      where: { booking_id, booking_code: code }, // Match booking ID & code
      include: [
        {
          model: Request,
          include: [
            {
              model: Customer,
              attributes: ["customer_id", "balance"], // Get customer balance
            },
          ],
        },
        {
          model: Tanker,
          attributes: ["cost"], // Get tanker cost
        },
      ],
      transaction,
      //   lock: true, // Prevents race conditions
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid booking ID or code." });
    }

    const customer = booking.Request.Customer;
    const tankerCost = booking.Tanker.cost;

    if (customer.balance < tankerCost) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Deduct tanker cost from customer balance
    await Customer.update(
      { balance: customer.balance - tankerCost },
      { where: { customer_id: customer.customer_id }, transaction }
    );

    // Update booking status to Delivered
    await Bookings.update(
      { status: "Delivered" },
      { where: { booking_id }, transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({ message: "Booking successfully delivered." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error delivering booking:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// not tested yet

exports.updateDriver = async (req, res) => {
  const driver_id = req.params.id;
  const { full_name, email, phone_number, license_number, username, password } =
    req.body;
  const t = await sequelize.transaction(); // start transaction
  try {
    // Check if email is used by someone else
    const existingDriver = await Driver.findOne({
      where: {
        email,
        driver_id: { [Op.ne]: driver_id }, // Not the same driver
      },
      transaction: t,
    });

    if (existingDriver) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Email already in use by another driver." });
    }

    // Prepare update data
    let updateData = {
      full_name,
      email,
      phone_number,
      license_number,
      username,
    };
    // Hash password only if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the driver
    const updatedDriver = await Driver.update(updateData, {
      where: { driver_id },
      transaction: t,
    });
    if (updatedDriver[0] === 0) {
      throw new Error("Update not found for update.");
    }
    // Commit transaction if both operations succeed
    await t.commit();
    res.status(200).json({
      status: "success",
      data: updatedDriver,
    });
  } catch (error) {
    console.error(error);
    // Rollback transaction on error
    await t.rollback();
    res.status(500).json({
      status: "error",
      message: "Update failed.",
    });
  }
};

exports.deleteDriver = async (req, res) => {
  const driver_id = req.params.id;
  const t = await sequelize.transaction();
  try {
    // Delete the driver
    const deletedDriver = await Driver.destroy({
      where: { driver_id },
      transaction: t,
    });
    // Commit transaction if both operations succeed
    await t.commit();
    res.status(200).json({
      status: "success",
      data: deletedDriver,
    });
  } catch (error) {
    console.error(error);
    // Rollback transaction on error
    await t.rollback();
    res.status(500).json({
      status: "error",
      message: "Delete failed.",
    });
  }
};
