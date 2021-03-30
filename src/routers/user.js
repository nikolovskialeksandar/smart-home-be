import express from 'express';

import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create new user

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Log in user

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get user profile

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// Log out current session

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch {
    res.status(500).send();
  }
});

// Log out all sessions

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch {
    res.status(500).send();
  }
});

// Update user

router.patch('/users/me', auth, async (req, res) => {
  const allowedUpdates = ['username', 'email', 'password'];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send('Invalid updates');
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch {
    res.status(400).send();
  }
});

// Delete user

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

export default router;
