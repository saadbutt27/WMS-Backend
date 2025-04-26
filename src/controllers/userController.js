const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models_v2/customerModel");
const WaterTank = require("../models_v2/waterTankModel");
const Sensor = require("../models_v2/sensorModel");
const { UserTypes } = require("../models_v2/index");
const { sequelize } = require("../config/database.js");
const { Op } = require("sequelize");

const signupUser = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    street_address,
    phase_number,
    username,
    password,
    tank_capacity,
    balance,
    device_id,
    category,
  } = req.body;

  const t = await sequelize.transaction(); // start transaction

  try {
    // Check if a user with the same email or username already exists
    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
      transaction: t, // Important: pass transaction
      lock: t.LOCK.UPDATE, // Optional but good to avoid race conditions
    });

    if (existingCustomer) {
      console.log("Email or username already exists.");
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Email or username already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = await Customer.create(
      {
        full_name,
        email,
        phone_number,
        street_address,
        phase_number,
        username,
        password: hashedPassword,
        balance,
        user_type_id: 4, // Default to 4 for customer
        category,
      },
      { transaction: t } // Pass transaction here
    );

    // console.log(newCustomer.customer_id); // send this customer id to create water tanks's record

    // Create water tank record inside transaction
    const waterTank = await WaterTank.create(
      {
        customer_id: newCustomer.customer_id,
        sensor_id: device_id,
        capacity: tank_capacity,
      },
      { transaction: t } // Pass transaction here
    );

    // update sensors status to "Assigned"
    const sensor = await Sensor.update(
      {
        status: "Assigned",
      },
      {
        where: {
          sensor_id: device_id,
        },
        transaction: t,
      }
    );

    // console.log(waterTank);
    // Commit transaction if both operations succeed
    await t.commit();

    // Generate JWT
    const token = jwt.sign(
      { customer_id: newCustomer.customer_id, username: newCustomer.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Respond with the created customer (excluding the password) and the token
    res.status(201).json({
      message: "Signup successful.",
      customer: {
        customer_id: newCustomer.customer_id,
        full_name: newCustomer.full_name,
        email: newCustomer.email,
        phone_number: newCustomer.phone_number,
        home_address: newCustomer.home_address,
        username: newCustomer.username,
        balance: newCustomer.balance,
        created_at: newCustomer.created_at,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    // Rollback transaction on error
    await t.rollback();
    res.status(500).json({ error: "Signup failed." });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const customer = await Customer.findOne({ where: { username } });

    if (!customer) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign({ customer }, process.env.JWT_SECRET, {
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

// Renaming this function to avoid conflict
const getUsers = async (req, res) => {
  // console.log("get")
  try {
    // get customer id, anme address balance from customer table then device id from water tank table based on customer ids
    const users = await Customer.findAll({
      attributes: [
        "customer_id",
        "full_name",
        "email",
        "phone_number",
        "home_address",
        "username",
        "balance",
        "created_at",
      ],
      include: [
        {
          model: WaterTank,
          attributes: ["sensor_id"],
        },
        {
          model: UserTypes,
          attributes: ["type", "description"],
        },
      ],
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, getUsers };
