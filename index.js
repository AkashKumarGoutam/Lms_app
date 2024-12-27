const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");
const AdminRoutes = require("./routes/adminRoutes");
const FacultyRoutes = require("./routes/facultyRoutes")
const StudentRoutes = require("./routes/studentRoutes")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());

connectDB();

// Routes
app.use("/admin", AdminRoutes);
app.use("/faculty" , FacultyRoutes);
app.use("/student" , StudentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
