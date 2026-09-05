const express = require("express");
const db = require("../config/db");

const router = express.Router();


// ======================================================
// GET USER PREFERENCES
// GET /api/preferences/:userId
// ======================================================

router.get("/:userId", (req, res) => {

  const userId = req.params.userId;

  const sql = `
    SELECT
      id,
      user_id,
      sleep,
      cleanliness,
      social,
      food,
      study,
      guests
    FROM user_preferences
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      console.error("❌ Get preferences error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    // No preferences yet

    if (results.length === 0) {

      return res.status(200).json({
        success: true,
        preferences: null,
        message: "No preferences found",
      });

    }

    res.status(200).json({
      success: true,
      preferences: results[0],
    });

  });

});


// ======================================================
// CREATE / UPDATE USER PREFERENCES
// PUT /api/preferences/:userId
// ======================================================

router.put("/:userId", (req, res) => {

  const userId = req.params.userId;

  const {
    sleep,
    cleanliness,
    social,
    food,
    study,
    guests
  } = req.body;


  const sql = `
    INSERT INTO user_preferences
    (
      user_id,
      sleep,
      cleanliness,
      social,
      food,
      study,
      guests
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE
      sleep = VALUES(sleep),
      cleanliness = VALUES(cleanliness),
      social = VALUES(social),
      food = VALUES(food),
      study = VALUES(study),
      guests = VALUES(guests)
  `;


  db.query(
    sql,
    [
      userId,
      sleep || "",
      cleanliness || "",
      social || "",
      food || "",
      study || "",
      guests || ""
    ],
    (err, result) => {

      if (err) {

        console.error(
          "❌ Save preferences error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Database error",
        });

      }


      // Get saved preferences

      const getSql = `
        SELECT
          id,
          user_id,
          sleep,
          cleanliness,
          social,
          food,
          study,
          guests
        FROM user_preferences
        WHERE user_id = ?
      `;


      db.query(
        getSql,
        [userId],
        (err, results) => {

          if (err) {

            console.error(
              "❌ Fetch preferences error:",
              err
            );

            return res.status(500).json({
              success: false,
              message: "Preferences saved but could not fetch them",
            });

          }


          res.status(200).json({

            success: true,

            message:
              "Preferences saved successfully ❤️",

            preferences: results[0],

          });

        }
      );

    }
  );

});


module.exports = router;