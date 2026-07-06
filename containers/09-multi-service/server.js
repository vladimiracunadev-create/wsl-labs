'use strict';
// Backend que comprueba MongoDB por la red wslc (TCP, sin deps).
const http = require('http');
const net = require('net');

const port = process.env.PORT || 3000;
const mongoHost = process.env.MONGO_HOST || 'wslc-mongo';
const mongoPort = Number(process.env.MONGO_PORT || 27017);

function mongoReachable() {
  return new Promise((resolve) => {
    const sock = net.createConnection({ host: mongoHost, port: mongoPort }, () => { resolve(true); sock.destroy(); });
    sock.setTimeout(2000);
    sock.on('error', () => resolve(false));
    sock.on('timeout', () => { resolve(false); sock.destroy(); });
  });
}

http
  .createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const ok = await mongoReachable();
    if (req.url === '/health') return res.writeHead(ok ? 200 : 503).end(JSON.stringify({ status: ok ? 'ok' : 'mongo-down' }));
    res.writeHead(200).end(
      JSON.stringify({ project: 'wsl-labs', case: '09-multi-service', engine: 'wslc', mongo: ok ? 'reachable' : 'sin conexión', mongoHost })
    );
  })
  .listen(port, () => console.log(`multi-backend en :${port} -> ${mongoHost}:${mongoPort}`));
