'use strict';
const http = require('http');
const port = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.url === '/health') return res.writeHead(200).end('{"status":"ok"}');
    res.writeHead(200).end(
      JSON.stringify({ project: 'wsl-labs', case: '01-node-api', engine: 'wslc', runtime: 'container' })
    );
  })
  .listen(port, () => console.log(`node-api en :${port}`));
