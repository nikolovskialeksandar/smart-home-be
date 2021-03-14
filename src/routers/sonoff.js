import express from 'express';

import Sonoff from '../models/sonoff.js';

const router = new express.Router();

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

router.patch('/sonoff', async (req, res) => {
  try {
    const sonoffState = await Sonoff.findOne({});
    if (!sonoffState) {
      return res.set(404).send();
    }
    sonoffState.switch = req.body.switch;
    await sonoffState.save();
    res.send();
  } catch (error) {
    res.set(500).send(error);
  }
});

export default router;
