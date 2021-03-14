import express from 'express';

const router = new express.Router();

router.get('/sonoff', async (req, res) => {
  res.send('Testing');
});

router.patch('/sonoff', async (req, res) => {
  
});

export default router;
