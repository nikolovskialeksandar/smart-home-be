import express from 'express';
import http from 'http';
import './db/mongoose.js';
import sonoffRouter from './routers/sonoff.js';
import { initWebsocket } from './services/websocket.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

initWebsocket(server);

app.use(express.json());
app.use(sonoffRouter);

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
