'use strict';

// API de ejemplo de wsl-labs — módulo `http` nativo, SIN dependencias externas
// (no requiere `npm install`), para que arranque al instante dentro de WSL.
const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(200);
  res.end(
    JSON.stringify({
      project: 'wsl-labs',
      service: 'node-api',
      status: 'running',
      port: Number(port),
    })
  );
});

server.listen(port, () => {
  console.log(`wsl-labs node-api escuchando en http://localhost:${port}`);
});
