const express = require("express");
const db = require("../config/db");

const router = express.Router();


// ======================================================
// GET USER BY ID
// GET /api/users/:id
// ======================================================

router.get("/:id", (req, res) => {

  const userId = req.params.id;

  const sql = `
    SELECT
      id,
      name,
      email,
      role,
      location,
      bio
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      console.error("❌ Get user database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }


    // User not found

    if (results.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    // Send user

    res.status(200).json({
      success: true,
      user: results[0],
    });

  });

});



// ======================================================
// UPDATE USER
// PUT /api/users/:id
// ======================================================

router.put("/:id", (req, res) => {

  const userId = req.params.id;

  const {
    name,
    role,
    location,
    bio
  } = req.body;


  // Check required name

  if (!name || name.trim() === "") {

    return res.status(400).json({
      success: false,
      message: "Name is required",
    });

  }


  const sql = `
    UPDATE users
    SET
      name = ?,
      role = ?,
      location = ?,
      bio = ?
    WHERE id = ?
  `;


  db.query(
    sql,
    [
      name.trim(),
      role || "",
      location || "",
      bio || "",
      userId
    ],
    (err, result) => {

      if (err) {

        console.error(
          "❌ Update user database error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Database error",
        });

      }


      // User not found

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }


      // Get updated user

      const getUserSql = `
        SELECT
          id,
          name,
          email,
          role,
          location,
          bio
        FROM users
        WHERE id = ?
      `;


      db.query(
        getUserSql,
        [userId],
        (err, results) => {

          if (err) {

            console.error(
              "❌ Get updated user error:",
              err
            );

            return res.status(500).json({
              success: false,
              message: "User updated but could not fetch updated data",
            });

          }


          res.status(200).json({

            success: true,

            message: "Profile updated successfully ❤️",

            user: results[0],

          });

        }
      );

    }
  );

});


module.exports = router;