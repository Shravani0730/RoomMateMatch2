const express = require("express");
const db = require("../config/db");

const router = express.Router();


// =====================================================
// GET REAL MATCHES FOR A USER
// =====================================================

router.get("/:userId", (req, res) => {

  const userId = req.params.userId;


  // ===================================================
  // STEP 1: GET CURRENT USER'S PREFERENCES
  // ===================================================

  const userPreferenceSql = `
    SELECT *
    FROM user_preferences
    WHERE user_id = ?
  `;

  db.query(userPreferenceSql, [userId], (err, userResults) => {

    if (err) {
      console.error("❌ User preference error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message
      });
    }


    // No preferences found
    if (userResults.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Please complete the lifestyle quiz first."
      });

    }


    const myPreferences = userResults[0];


    // =================================================
    // STEP 2: GET OTHER USERS + THEIR PREFERENCES
    // =================================================

    const matchesSql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.location,
        u.bio,

        p.sleep,
        p.cleanliness,
        p.social,
        p.food,
        p.study,
        p.guests

      FROM users u

      INNER JOIN user_preferences p
        ON u.id = p.user_id

      WHERE u.id != ?
    `;


    db.query(matchesSql, [userId], (err, results) => {

      if (err) {

        console.error("❌ Matches database error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message
        });

      }


      // =================================================
      // STEP 3: CALCULATE COMPATIBILITY
      // =================================================

      const matches = results.map((person) => {

        let score = 0;

        const totalCategories = 6;


        // Sleep
        if (myPreferences.sleep === person.sleep) {
          score++;
        }


        // Cleanliness
        if (myPreferences.cleanliness === person.cleanliness) {
          score++;
        }


        // Social
        if (myPreferences.social === person.social) {
          score++;
        }


        // Food
        if (myPreferences.food === person.food) {
          score++;
        }


        // Study
        if (myPreferences.study === person.study) {
          score++;
        }


        // Guests
        if (myPreferences.guests === person.guests) {
          score++;
        }


        // =================================================
        // CALCULATE PERCENTAGE
        // =================================================

        const compatibility = Math.round(
          (score / totalCategories) * 100
        );


        return {

          id: person.id,

          name: person.name,

          email: person.email,

          role: person.role,

          location: person.location,

          bio: person.bio,


          preferences: {

            sleep: person.sleep,

            cleanliness: person.cleanliness,

            social: person.social,

            food: person.food,

            study: person.study,

            guests: person.guests

          },


          compatibility: compatibility,

          matchedCategories: score,

          totalCategories: totalCategories

        };

      });


      // =================================================
      // STEP 4: SORT BEST MATCHES FIRST
      // =================================================

      matches.sort(
        (a, b) => b.compatibility - a.compatibility
      );


      // =================================================
      // STEP 5: SEND RESPONSE
      // =================================================

      res.status(200).json({

        success: true,

        count: matches.length,

        matches: matches

      });

    });

  });

});


module.exports = router;