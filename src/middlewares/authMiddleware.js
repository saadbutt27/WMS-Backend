const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies?.admin_token; // Get token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access Denied. Not an Admin." });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token." });
  }
};

const superAdminAuth = (req, res, next) => {
  const token = req.cookies?.admin_token; // Get token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded)

    if (!decoded.is_super) {
      return res.status(403).json({ message: "Access Denied. Not a Super Admin." });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token." });
  }
};

module.exports = { adminAuth, superAdminAuth };
