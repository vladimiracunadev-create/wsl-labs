const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    project: 'wsl-labs',
    service: 'node-api',
    status: 'running'
  });
});

app.listen(port, () => {
  console.log(`wsl-labs node-api running on http://localhost:${port}`);
});
