const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// POST Contact Message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    const newMessage = new ContactMessage({ name, email, phone, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Error submitting message:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
