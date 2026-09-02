
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authroutes");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);


// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RoomMate Match Backend is running ❤️",
  });
});


// ================= DATABASE TEST =================

app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 AS test", (err, result) => {

    if (err) {
      console.error("Database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Database connected successfully ❤️",
      result: result,
    });
  });
});


// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});