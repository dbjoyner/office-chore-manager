const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    // Sort newest first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notif = await notificationService.markRead(req.params.id, req.user.id);
    if (!notif) return res.status(404).json({ error: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/read-all', auth, async (req, res) => {
  try {
    await notificationService.markAllRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
