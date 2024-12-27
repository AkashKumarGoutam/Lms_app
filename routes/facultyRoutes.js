const httpStatus = require("http-status");
const jwt = require("jsonwebtoken")
const facultyModel = require("../models/facultyModel");

const router = require("express").Router();

const JWT_SECRET = process.env.JWT_SECRET;


// Faculty login
router.post("/faculty_login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "please fill all feilds carefully" });
  }

  try {
    const check_faculty = await facultyModel.findOne({ email });
    if (!check_faculty) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Faculty doesn't exits" });
    }
    // Generate JWT token
    const token = jwt.sign({ email: check_faculty.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Send success response
    return res.status(httpStatus.OK).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    // Handle server errors
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Faculty logout
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.status(httpStatus.OK).json({ message: "Logout successful" });
  });


  // Middleware for verifying token
const verifyFaculty = (req, res, next) => {
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
  router.get("/verify_faculty", verifyFaculty, (req, res) => {
    return res
      .status(httpStatus.OK)
      .json({ status: true, message: "Authorized" });
  });
module.exports = router;
