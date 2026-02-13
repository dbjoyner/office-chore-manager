const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const choreService = require('../services/choreService');
const notificationService = require('../services/notificationService');

router.get('/', auth, async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'from and to query params are required' });
    }
    const chores = await choreService.getChores(from, to);
    res.json(chores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    const chore = await choreService.createChore(req.body, req.user.id);

    // Notify assignee if assigned to someone else
    if (chore.assigneeId && chore.assigneeId !== req.user.id) {
      await notificationService.createNotification({
        userId: chore.assigneeId,
        type: 'assigned',
        choreId: chore.id,
        message: `You've been assigned the chore: ${chore.title}`,
      });
    }

    res.status(201).json(chore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const chore = await choreService.updateChore(req.params.id, req.body);
    if (!chore) return res.status(404).json({ error: 'Chore not found' });
    res.json(chore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await choreService.deleteChore(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Chore not found' });
    res.json({ message: 'Chore deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/move', auth, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required' });
    const chore = await choreService.moveChore(req.params.id, date);
    if (!chore) return res.status(404).json({ error: 'Chore not found' });
    res.json(chore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/assign', auth, async (req, res) => {
  try {
    const { assigneeId } = req.body;
    if (!assigneeId) return res.status(400).json({ error: 'assigneeId is required' });
    const chore = await choreService.assignChore(req.params.id, assigneeId);
    if (!chore) return res.status(404).json({ error: 'Chore not found' });

    // Notify the new assignee
    if (assigneeId !== req.user.id) {
      await notificationService.createNotification({
        userId: assigneeId,
        type: 'assigned',
        choreId: chore.id,
        message: `You've been assigned the chore: ${chore.title}`,
      });
    }

    res.json(chore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const chore = await choreService.completeChore(req.params.id, req.user.id);
    if (!chore) return res.status(404).json({ error: 'Chore not found' });

    // Notify the creator if a different user completed it
    if (chore.completed && chore.createdBy && chore.createdBy !== req.user.id) {
      await notificationService.createNotification({
        userId: chore.createdBy,
        type: 'completed',
        choreId: chore.id,
        message: `The chore "${chore.title}" has been completed`,
      });
    }

    res.json(chore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
