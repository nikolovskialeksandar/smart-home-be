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
    name: req.body.name,
  });
  try {
    await sonoff.save();
    res.status(201).send(sonoff);
  } catch {
    res.status(400).send();
  }
});

// Get device

router.get('/sonoff/:id', auth, async (req, res) => {
  try {
    const sonoff = await Sonoff.findOne({
      _id: req.params.id,
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

// Get all user devices

router.get('/sonoff', auth, async (req, res) => {
  try {
    await req.user.populate({
      path: 'sonoffDevices',
    }).execPopulate();
    res.send(req.user.sonoffDevices);
  } catch {
    res.status(500).send();
  }
});

// Set device state / update device

router.patch('/sonoff/:id', auth, async (req, res) => {
  const allowedUpdates = ['name', 'state'];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send('Invalid updates');
  }

  try {
    const sonoff = await Sonoff.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!sonoff) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      sonoff[update] = req.body[update];
    });

    await sonoff.save();
 
    // Send state to device
    if (updates.includes('state')) {
      let socketMessage = null;
      if (sonoff.state) {
        socketMessage = 'true';
      } else {
        socketMessage = 'false';
      }

      connections.forEach((socket) => socket.send(socketMessage));
    }
    res.send(sonoff);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete device

router.delete('/sonoff/:id', auth, async (req, res) => {
  try {
    const sonoff = await Sonoff.findOneAndDelete({
      _id: req.params.id,
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

export default router;
