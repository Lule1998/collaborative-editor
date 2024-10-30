const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const documents = new Map();

wss.on('connection', (ws) => {
  const siteId = Math.random().toString(36).substring(7);
  let currentDoc = null;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    // Implementacija iz prethodnog primera
  });
});