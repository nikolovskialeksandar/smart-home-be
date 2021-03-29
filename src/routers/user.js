import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// Create new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Log in user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
