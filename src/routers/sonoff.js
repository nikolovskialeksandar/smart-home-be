import express from 'express';

import Sonoff from '../models/sonoff.js';
import { connections } from '../services/websocket.js';

const router = new express.Router();

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

    sonoffState.switch = req.body.switch;
    await sonoffState.save();

    // Send state to device
    let socketMessage = null;
    if (sonoffState.switch) {
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
