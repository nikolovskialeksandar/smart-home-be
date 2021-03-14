import express from 'express';

import sonoffRouter from './routers/sonoff.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(sonoffRouter);

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
