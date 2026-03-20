const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// GET all notifications for a specific user
router.get('/:userId', async (req, res) => {
  try {
    // Force everything to be a string to ensure they match
    const searchId = String(req.params.userId).trim(); 
    
    // Querying recipientId as a string match
    const notifications = await Notification.find({ 
      recipientId: searchId 
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${notifications.length} notifications for ${searchId}`);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});
// PATCH to mark a notification as read
router.patch('/read/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;