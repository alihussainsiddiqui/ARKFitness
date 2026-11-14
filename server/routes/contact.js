const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @desc    Submit a contact form message
// @route   POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    await Message.create({ name, email, subject, message });

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error("Contact Form Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;