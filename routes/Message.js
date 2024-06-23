const express = require("express");
const router = express.Router();
const msg = require("../models/MsgSchema");

// POST /message
router.post("/message", async (req, res, next) => {
  const { name, email, subject, comment, date } = req.body;
  if (!name || !email || !subject) {
    return res.status(400).json({
      success: false,
      message: "Marked details are mandatory",
    });
  }
  try {
    await msg.create({ name, email, subject, comment, date });
    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    // Handle any database errors or other exceptions
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the message",
    });
  }
});

module.exports = router;
