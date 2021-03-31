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

router.get('/sonoff/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const sonoff = await Sonoff.findOne({
      _id,
      owner: req.user._id,
    });

    if (!sonoff) {
      return res.status(404).send();
    }

    res.send(sonoff);
  } catch {
    res.status(500).send();
  }
});

// Set device state

router.patch('/sonoff/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const sonoff = await Sonoff.findOne({
      _id,
      owner: req.user._id,
    });
    if (!sonoff) {
      return res.status(404).send();
    }

    sonoff.state = req.body.state;
    await sonoff.save();

    // Send state to device
    let socketMessage = null;
    if (sonoff.state) {
      socketMessage = 'true';
    } else {
      socketMessage = 'false';
    }

    connections.forEach((socket) => socket.send(socketMessage));
    res.send(sonoff);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
