const express = require("express");

const router = express.Router();

const db = require("../config/db");

// =====================================================
// GET USER NOTIFICATIONS
// GET /api/notifications/:userId
// =====================================================

router.get("/:userId", (req, res) => {

  const userId = req.params.userId;

  const query = `
    SELECT
      c.id,
      c.sender_id,
      c.receiver_id,
      c.status,
      c.created_at,

      sender.name AS sender_name,
      sender.email AS sender_email

    FROM connections c

    JOIN users sender
      ON c.sender_id = sender.id

    WHERE c.receiver_id = ?

    ORDER BY c.created_at DESC
  `;

  db.query(
    query,
    [userId],
    (error, results) => {

      if (error) {

        console.error(
          "Get notifications error:",
          error
        );

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      const notifications = results.map((item) => {

        let title = "";
        let message = "";
        let type = "";
        let icon = "";

        // ---------------------------------------------
        // PENDING
        // ---------------------------------------------

        if (item.status === "pending") {

          title = "Connection request";

          message =
            `${item.sender_name} sent you a connection request.`;

          type = "connection";

          icon = "💕";
        }

        // ---------------------------------------------
        // ACCEPTED
        // ---------------------------------------------

        else if (item.status === "accepted") {

          title = "Connection accepted";

          message =
            `${item.sender_name} accepted your connection request.`;

          type = "accepted";

          icon = "💚";
        }

        // ---------------------------------------------
        // REJECTED
        // ---------------------------------------------

        else if (item.status === "rejected") {

          title = "Connection request declined";

          message =
            `${item.sender_name} declined your connection request.`;

          type = "rejected";

          icon = "💔";
        }

        return {
          id: item.id,

          type,

          icon,

          title,

          message,

          status: item.status,

          sender_id: item.sender_id,

          sender_name: item.sender_name,

          created_at: item.created_at
        };

      });

      res.json({
        success: true,
        count: notifications.length,
        notifications
      });

    }
  );

});


module.exports = router;