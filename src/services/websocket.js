import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

import Sonoff from '../models/sonoff.js';

// eslint-disable-next-line import/no-mutable-exports
let connections;

function heartbeat() {
  this.isAlive = true;
}

const initWebsocket = (server) => {
  const ws = new WebSocket.Server({
    server,
    clientTracking: true,
    async verifyClient(info, cb) {
      try {
        const token = info.req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sonoff = await Sonoff.findOne({ _id: decoded._id, token });
        if (sonoff) {
          info.req.sonoff = sonoff;
          cb(true);
        } else if (!sonoff) {
          cb(false, 401, 'Please authenticate');
        }
      } catch {
        cb(false, 400);
      }
    },
  });

  ws.on('connection', (socket, req) => {
    socket.id = req.sonoff.id;
    socket.isAlive = true;
    socket.on('pong', heartbeat);
  });

  // Clear broken connections

  setInterval(() => {
    ws.clients.forEach((socket) => {
      if (socket.isAlive === false) {
        return socket.terminate();
      }

      socket.isAlive = false;
      socket.ping();
    });
  }, 10000);

  connections = ws.clients;
};

export { initWebsocket, connections };
