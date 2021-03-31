import express from 'express';

import Sonoff from '../models/sonoff.js';
import { connections } from '../services/websocket.js';
import auth from '../middleware/auth.js';

const router = new express.Router();

// Add new device

router.post('/sonoff', auth, async (req, res) => {
  const sonoff = new Sonoff({
    owner: req.user._id,
    state: false,
  });
  try {
    await sonoff.save();
    res.status(201).send(sonoff);
  } catch {
    res.status(400).send();
  }
});

// Get device state

router.get('/sonoff', async (req, res) => {
  try {
    const sonoffState = await Sonoff.findOne({});
    if (!sonoffState) {
      return res.set(404).send();
    }

    res.send(sonoffState.switch);
  } catch (error) {
    res.set(500).send(error);
  }
});

// Set device state

router.patch('/sonoff', async (req, res) => {
  try {
    const sonoffState = await Sonoff.findOne({});
    if (!sonoffState) {
      return res.set(404).send();
    }

    sonoffState.state = req.body.state;
    await sonoffState.save();

    // Send state to device
    let socketMessage = null;
    if (sonoffState.state) {
      socketMessage = 'true';
    } else {
      socketMessage = 'false';
    }

    connections.forEach((socket) => socket.send(socketMessage));
    res.send();
  } catch (error) {
    res.set(500).send(error);
  }
});

export default router;
