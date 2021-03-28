import WebSocket from 'ws';

const connections = [];

const initWebsocket = (server) => {
  const ws = new WebSocket.Server({ server });
  ws.on('connection', (socket, req) => {
    console.log(req.socket.remoteAddress);
    connections.push(socket);
  });
};

export { initWebsocket, connections };
