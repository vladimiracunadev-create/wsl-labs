'use strict';
// App que consulta Redis por la red wslc usando el protocolo RESP (sin deps).
const http = require('http');
const net = require('net');

const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || 'wslc-redis';
const redisPort = Number(process.env.REDIS_PORT || 6379);

function redisPing() {
  return new Promise((resolve) => {
    const sock = net.createConnection({ host: redisHost, port: redisPort }, () => sock.write('PING\r\n'));
    sock.setTimeout(2000);
    sock.on('data', (d) => { resolve(d.toString().includes('PONG')); sock.destroy(); });
    sock.on('error', () => resolve(false));
    sock.on('timeout', () => { resolve(false); sock.destroy(); });
  });
}

http
  .createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const pong = await redisPing();
    if (req.url === '/health') return res.writeHead(pong ? 200 : 503).end(JSON.stringify({ status: pong ? 'ok' : 'redis-down' }));
    res.writeHead(200).end(
      JSON.stringify({ project: 'wsl-labs', case: '04-redis-cache', engine: 'wslc', redis: pong ? 'PONG' : 'sin conexión', redisHost })
    );
  })
  .listen(port, () => console.log(`redis-app en :${port} -> ${redisHost}:${redisPort}`));
