const express = require("express");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const adminModel = require("../models/adminModels");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Admin login
router.post("/admin_login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please fill all fields carefully" });
  }

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Account does not exist" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: admin.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(httpStatus.OK).json({ message: "Login successful" , token: token, });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

// Admin logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(httpStatus.OK).json({ message: "Logout successful" });
});

// Middleware for verifying token
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "No token available" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

// Protected route
router.get("/verify_admin", verifyAdmin, (req, res) => {
  return res
    .status(httpStatus.OK)
    .json({ status: true, message: "Authorized" });
});

module.exports = router;
