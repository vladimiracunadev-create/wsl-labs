'use strict';

// wsl-labs · API de ejemplo para imagen WSLC (módulo http nativo, sin deps).
const http = require('http');
const port = process.env.PORT || 8082;

http
  .createServer((req, res) => {
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
        runtime: 'wslc-container',
        service: 'node-api',
        image: 'wsl-labs/node-api',
        port: Number(port),
      })
    );
  })
  .listen(port, () => console.log(`node-api (WSLC) en http://localhost:${port}`));
