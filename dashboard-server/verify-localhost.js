'use strict';

/*
 * verify-localhost.js — verificación del panel de contenedores (sin deps).
 * Comprueba: (a) containers.config.json parsea y tiene casos, (b) el servidor
 * arranca y /api/wslc/overview responde 200, (c) los puertos de host no colisionan.
 * Sale con código 0/1. No requiere que wslc esté instalado.
 */

const http = require('http');
const { createServer, loadConfig } = require('./server');

let failures = 0;
const ok = (m) => console.log(`  [OK]   ${m}`);
const bad = (m) => { console.log(`  [FALLO] ${m}`); failures += 1; };

(async () => {
  console.log('(a) containers.config.json');
  let config;
  try {
    config = loadConfig();
    ok('parsea como JSON válido.');
    if (config.cases.length) ok(`contiene ${config.cases.length} casos.`); else bad('sin casos.');
    if (config.cases.every((c) => c.id && c.name)) ok('todos los casos tienen id y name.'); else bad('algún caso sin id/name.');
  } catch (e) {
    bad(`no se pudo cargar: ${e.message}`);
    process.exit(1);
  }

  console.log('\n(c) Puertos de host declarados');
  const ports = [];
  for (const c of config.cases) {
    for (const k of c.containers || []) {
      for (const p of k.ports || []) ports.push(String(p).split(':')[0]);
    }
  }
  const dups = ports.filter((p, i) => ports.indexOf(p) !== i);
  if (!dups.length) ok(`sin colisiones (${new Set(ports).size} puerto(s) único(s)).`);
  else bad(`puertos duplicados: ${[...new Set(dups)].join(', ')}`);

  console.log('\n(b) Server + /api/wslc/overview');
  const server = createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  ok(`server escuchando en 127.0.0.1:${port}.`);
  await new Promise((resolve) => {
    http.get({ host: '127.0.0.1', port, path: '/api/wslc/overview', timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => {
        if (res.statusCode === 200) ok('/api/wslc/overview respondió 200.'); else bad(`overview respondió ${res.statusCode}.`);
        try {
          const j = JSON.parse(data);
          if (Array.isArray(j.cases)) ok(`overview devolvió ${j.cases.length} casos.`); else bad('overview sin "cases".');
        } catch { bad('overview no devolvió JSON válido.'); }
        resolve();
      });
    }).on('error', (e) => { bad(`overview falló: ${e.message}`); resolve(); });
  });
  server.close();

  console.log(`\nRESULTADO: ${failures === 0 ? 'OK — todas las verificaciones pasaron.' : `${failures} fallo(s).`}`);
  process.exit(failures === 0 ? 0 : 1);
})();
