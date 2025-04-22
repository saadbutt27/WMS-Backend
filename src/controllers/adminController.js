// const { Op } = require("sequelize");
// const {
//   WaterTank,
//   WaterTankStatus,
//   Request,
//   Customer,
// } = require("../models_v2/index");
const { Admin, Request, Customer } = require("../models_v2/index");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
      "user_type_id",
    ], // Exclude password_hash
  });

  if (!admin) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  // Restrict login for super admins
  if (admin.is_super) {
    return res.status(403).json({
      message: "Access denied. Super admins cannot log in here.",
    });
  }

  //   const isMatch = await bcrypt.compare(password, admin.password);
  const isMatch = await bcrypt.compareSync(password, admin.password_hash);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign(
    { full_name: admin.full_name, email: admin.email, isAdmin: true },
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
    access_token: token,
  });
};

exports.logout = async (req, res) => {
  // res.clearCookie("admin_token");
  res.json({ message: "Logged out successfully" });
};

// Get all requests for the admin
exports.allRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Customer,
          attributes: ["customer_id", "full_name"], // Fetch only the full_name of the customer
        },
      ],
      attributes: [
        "request_id",
        "requested_liters",
        "request_status",
        "request_date",
      ], // Exclude customer_id for cleaner response
    });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No requests found" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Get all requests for the admin
exports.countAllRequests = async (req, res) => {
  try {
    const totalPendingRequests = await Request.count({
      where: { request_status: "In Progress" }, // Add condition here
    });

    res.status(200).json({ total_pending_requests: totalPendingRequests });
  } catch (error) {
    console.error("Error counting pending requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
