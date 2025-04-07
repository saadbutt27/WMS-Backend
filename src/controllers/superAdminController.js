const { Admin } = require("../models_v2/index");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { where, Op } = require("sequelize");
const { sequelize } = require("../config/database.js");

// Fetch customer details
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({
    where: {
      email,
    }, // Apply filtering dynamically
    attributes: [
      "admin_id",
      "full_name",
      "email",
      "password_hash",
      "created_at",
      "is_super",
    ], // Exclude password_hash
  });

  if (!admin) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  // Restrict login to only super admins
  if (!admin.is_super) {
    return res.status(403).json({
      message: "Access denied. Only super admins can log in.",
    });
  }

  //   const isMatch = await bcrypt.compare(password, admin.password);
  const isMatch = await bcrypt.compareSync(password, admin.password_hash);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign(
    {
      admin_id: admin.admin_id,
      full_name: admin.full_name,
      email: admin.email,
      isAdmin: true,
      is_super: admin.is_super,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Store token in HTTP-only cookie
  // res.cookie("admin_token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  //   sameSite: "Strict", // Prevent CSRF attacks
  //   maxAge: 3600000, // 1 hour
  // });

  res.json({
    admin_id: admin.admin_id,
    full_name: admin.full_name,
    email: admin.email,
    is_super: admin.is_super,
    admin_token: token,
  });
};

exports.logout = async (req, res) => {
  // res.clearCookie("admin_token");
  res.json({ message: "Logged out successfully" });
};

exports.getAllAdmins = async (req, res) => {
  try {
    // Check if admin with the email already exists
    const admins = await Admin.findAll();
    // if (admins) {
    //   return res.status(400).json({ message: "Admins do not exist" });
    // }

    res.status(201).json({
      // message: `Admin created successfully`,
      admins,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createAdmin = async (req, res) => {
  const { full_name, email, password, is_super } = req.body;
  const t = await sequelize.transaction(); // start transaction
  try {
    // Check if admin with the email already exists
    const existingAdmin = await Admin.findOne({
      where: {
        email,
      },
      transaction: t,
    });
    if (existingAdmin) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin in the database
    const newAdmin = await Admin.create(
      {
        full_name,
        email,
        password_hash: hashedPassword, // Save hashed password
        is_super,
      },
      { transaction: t }
    );

    // Commit transaction if both succeed
    await t.commit();

    res.status(200).json({
      message: "Created admin successfully.",
      newAdmin,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateAdmin = async (req, res) => {
  const { admin_id, full_name, email, password, is_super } = req.body;
  const t = await sequelize.transaction(); // start transaction
  try {
    // Check if admin with the email already exists
    const existingAdmin = await Admin.findOne({
      where: {
        email,
        admin_id: { [Op.ne]: admin_id }, // Not the same customer
      },
      transaction: t,
    });
    if (existingAdmin) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin in the database
    const updatedAdmin = await Admin.update(
      {
        full_name,
        email,
        password_hash: hashedPassword,
        is_super,
      },
      {
        where: { admin_id },
        transaction: t, // ✅ Transaction inside same options object
      }
    );

    // Commit transaction if both succeed
    await t.commit();

    res.status(200).json({
      message: "Update successful.",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error udpating admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  const admin_id = req.query.admin_id; // Change here 👈
  const t = await sequelize.transaction();
  try {
    // Delete the customer
    await Admin.destroy(
      {
        where: { admin_id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    res.status(200).json({ message: "Delete successful." });
  } catch (error) {
    console.error(error);
    // Rollback transaction on error
    await t.rollback();
    res.status(500).json({ error: "Delete failed." });
  }
};
