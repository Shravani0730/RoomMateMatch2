const express = require("express");

const router = express.Router();


// =====================================================
// SEND CONNECTION REQUEST
// POST /api/connections
// =====================================================

router.post("/", (req, res) => {

  const db = req.app.locals.db;

  const { sender_id, receiver_id } = req.body;

  if (!sender_id || !receiver_id) {
    return res.status(400).json({
      success: false,
      message: "sender_id and receiver_id are required"
    });
  }

  if (Number(sender_id) === Number(receiver_id)) {
    return res.status(400).json({
      success: false,
      message: "You cannot connect with yourself"
    });
  }


  const checkQuery = `
    SELECT *
    FROM connections
    WHERE
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
  `;

  db.query(
    checkQuery,
    [sender_id, receiver_id, receiver_id, sender_id],
    (checkError, existing) => {

      if (checkError) {
        console.error("Connection check error:", checkError);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }


      if (existing.length > 0) {

        return res.status(400).json({
          success: false,
          message: "Connection already exists",
          connection: existing[0]
        });

      }


      const insertQuery = `
        INSERT INTO connections
        (sender_id, receiver_id, status)
        VALUES (?, ?, 'pending')
      `;

      db.query(
        insertQuery,
        [sender_id, receiver_id],
        (insertError, result) => {

          if (insertError) {
            console.error("Connection insert error:", insertError);

            return res.status(500).json({
              success: false,
              message: "Database error"
            });
          }


          res.status(201).json({
            success: true,
            message: "Connection request sent ❤️",
            connection: {
              id: result.insertId,
              sender_id: Number(sender_id),
              receiver_id: Number(receiver_id),
              status: "pending"
            }
          });

        }
      );

    }
  );

});


// =====================================================
// GET USER CONNECTIONS
// GET /api/connections/:userId
// =====================================================

router.get("/:userId", (req, res) => {

  const db = req.app.locals.db;

  const userId = req.params.userId;


  const query = `
    SELECT
      c.id,
      c.sender_id,
      c.receiver_id,
      c.status,
      c.created_at,
      c.updated_at,

      sender.name AS sender_name,
      sender.email AS sender_email,

      receiver.name AS receiver_name,
      receiver.email AS receiver_email

    FROM connections c

    JOIN users sender
      ON c.sender_id = sender.id

    JOIN users receiver
      ON c.receiver_id = receiver.id

    WHERE c.sender_id = ?
       OR c.receiver_id = ?

    ORDER BY c.created_at DESC
  `;


  db.query(
    query,
    [userId, userId],
    (error, results) => {

      if (error) {

        console.error("Get connections error:", error);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });

      }


      res.json({
        success: true,
        count: results.length,
        connections: results
      });

    }
  );

});


// =====================================================
// UPDATE CONNECTION
// PUT /api/connections/:id
// =====================================================

router.put("/:id", (req, res) => {

  const db = req.app.locals.db;

  const connectionId = req.params.id;

  const { status } = req.body;


  const allowedStatuses = [
    "accepted",
    "rejected"
  ];


  if (!allowedStatuses.includes(status)) {

    return res.status(400).json({
      success: false,
      message: "Status must be accepted or rejected"
    });

  }


  const query = `
    UPDATE connections
    SET status = ?
    WHERE id = ?
  `;


  db.query(
    query,
    [status, connectionId],
    (error, result) => {

      if (error) {

        console.error("Update connection error:", error);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });

      }


      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Connection not found"
        });

      }


      res.json({
        success: true,
        message: `Connection ${status} ❤️`,
        status
      });

    }
  );

});


module.exports = router;