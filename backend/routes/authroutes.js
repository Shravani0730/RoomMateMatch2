const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();


// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      bio
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Check email
    const checkEmail = "SELECT id FROM users WHERE email = ?";

    db.query(checkEmail, [email], async (err, results) => {

      if (err) {
        console.error("Database error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      // Email already exists
      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already registered"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const sql = `
        INSERT INTO users
        (name, email, password, role, location, bio)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          name,
          email,
          hashedPassword,
          role || "",
          location || "",
          bio || ""
        ],
        (err, result) => {

          if (err) {
            console.error("Registration error:", err);

            return res.status(500).json({
              success: false,
              message: "Registration failed"
            });
          }

          res.status(201).json({
            success: true,
            message: "Registration successful ❤️",
            userId: result.insertId
          });

        }
      );

    });

  } catch (error) {

    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const sql = `
      SELECT id, name, email, password, role, location, bio
      FROM users
      WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {

      if (err) {
  console.error("❌ LOGIN DATABASE ERROR");
  console.error("Code:", err.code);
  console.error("Message:", err.message);
  console.error("SQL:", err.sql);

  return res.status(500).json({
    success: false,
    message: "Database error",
    error: err.message
  });
}

      // User not found
      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const user = results[0];

      // Compare password
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      // Remove password before sending user data
      delete user.password;

      // Login successful
      res.status(200).json({
        success: true,
        message: "Login successful ❤️",
        user: user
      });

    });

  } catch (error) {

    console.error("Login server error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});


module.exports = router;