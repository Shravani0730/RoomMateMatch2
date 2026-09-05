const express = require("express");
const router = express.Router();

const db = require("../config/db");

// =====================================================
// GET TOTAL MESSAGE COUNT FOR USER
// GET /api/chat/count/:userId
// =====================================================

router.get("/count/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT COUNT(*) AS count
    FROM messages
    WHERE sender_id = ? OR receiver_id = ?
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("❌ Get message count error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.status(200).json({
      success: true,
      count: Number(results[0].count),
    });
  });
});


// =====================================================
// GET CHAT MESSAGES
// GET /api/chat/:userId/:otherUserId
// =====================================================

router.get("/:userId/:otherUserId", (req, res) => {
  const { userId, otherUserId } = req.params;

  const sql = `
    SELECT
      id,
      sender_id,
      receiver_id,
      message,
      created_at
    FROM messages
    WHERE
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  db.query(
    sql,
    [userId, otherUserId, otherUserId, userId],
    (err, results) => {
      if (err) {
        console.error("❌ Get messages error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      res.status(200).json({
        success: true,
        count: results.length,
        messages: results,
      });
    }
  );
});


// =====================================================
// SEND MESSAGE
// POST /api/chat
// =====================================================

router.post("/", (req, res) => {
  const {
    sender_id,
    receiver_id,
    message,
  } = req.body;

  // ---------------------------------------------------
  // Validate required fields
  // ---------------------------------------------------

  if (!sender_id || !receiver_id || message === undefined) {
    return res.status(400).json({
      success: false,
      message: "Sender, receiver and message are required",
    });
  }

  // ---------------------------------------------------
  // Clean message
  // ---------------------------------------------------

  const cleanMessage = String(message).trim();

  if (!cleanMessage) {
    return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
    });
  }

  // ---------------------------------------------------
  // Insert message
  // ---------------------------------------------------

  const sql = `
    INSERT INTO messages
    (sender_id, receiver_id, message)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [sender_id, receiver_id, cleanMessage],
    (err, result) => {
      if (err) {
        console.error("❌ Send message error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      // ------------------------------------------------
      // Get newly created message
      // ------------------------------------------------

      const messageSql = `
        SELECT
          id,
          sender_id,
          receiver_id,
          message,
          created_at
        FROM messages
        WHERE id = ?
      `;

      db.query(
        messageSql,
        [result.insertId],
        (messageErr, messageResult) => {
          if (messageErr) {
            console.error(
              "❌ Get new message error:",
              messageErr
            );

            return res.status(500).json({
              success: false,
              message: "Message saved but could not be retrieved",
            });
          }

          if (messageResult.length === 0) {
            return res.status(500).json({
              success: false,
              message: "Message saved but could not be retrieved",
            });
          }

          res.status(201).json({
            success: true,
            message: "Message sent successfully ❤️",
            chat: messageResult[0],
          });
        }
      );
    }
  );
});


// =====================================================
// DELETE MESSAGE
// DELETE /api/chat/:messageId
// =====================================================

router.delete("/:messageId", (req, res) => {
  const { messageId } = req.params;

  const sql = `
    DELETE FROM messages
    WHERE id = ?
  `;

  db.query(sql, [messageId], (err, result) => {
    if (err) {
      console.error("❌ Delete message error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  });
});


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;