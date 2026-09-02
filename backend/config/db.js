const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "172.26.32.211",
  user: "roommate_user",
  password: "RoomMate@12345",
  database: "roommate_match",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }

  console.log("✅ MySQL connected successfully!");
});

module.exports = db;