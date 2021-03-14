import express from 'express';

import './db/mongoose.js';
import sonoffRouter from './routers/sonoff.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(sonoffRouter);

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
