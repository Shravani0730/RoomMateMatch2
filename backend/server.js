const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const preferencesRoutes = require("./routes/preferencesroutes");
const matchRoutes = require("./routes/matchroutes");
const chatRoutes = require("./routes/chatroutes");
const connectionRoutes = require("./routes/connections");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json());
app.locals.db = db;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RoomMate Match Backend is running ❤️",
  });
});

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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});