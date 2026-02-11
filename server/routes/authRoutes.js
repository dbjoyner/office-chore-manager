const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const auth = require('../middleware/auth');

router.post('/signup', async (req, res) => {
  try {
    const { email, displayName, password } = req.body;
    if (!email || !displayName || !password) {
      return res.status(400).json({ error: 'Email, display name, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const result = await authService.signup({ email, displayName, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await authService.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
