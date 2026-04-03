const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contact.controller');

router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }
  try {
    const emailResult = await sendContactEmail({ name, email, phone, message });

    if (!emailResult?.sent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send message.',
        reason: emailResult?.reason || 'Unknown error'
      });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact email error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;
