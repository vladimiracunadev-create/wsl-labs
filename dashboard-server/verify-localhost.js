'use strict';

/*
 * verify-localhost.js — verificacion del WSL Control Center
 * ---------------------------------------------------------
 * Script Node nativo (sin dependencias) que valida:
 *   (a) labs.config.json parsea y tiene un array `labs` no vacio.
 *   (b) el server arranca y responde /api/overview con JSON coherente.
 *   (c) los puertos declarados por los labs no colisionan entre si.
 *
 * Sale con codigo 0 si todo pasa, 1 si algo falla. Pensado para `make test-dashboard` y CI.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const { createServer, PORT: DEFAULT_PORT } = require('./server');

const REPO_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(REPO_ROOT, 'labs.config.json');

// Puerto de prueba distinto al de produccion para no chocar con un server real.
const TEST_PORT = Number(process.env.VERIFY_PORT || 9192);

let failures = 0;

function pass(message) {
  console.log(`  [OK]   ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`  [FAIL] ${message}`);
}

// (a) Validacion de labs.config.json ─────────────────────────────────────────
function checkConfig() {
  console.log('\n(a) labs.config.json');
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (error) {
    fail(`No se pudo parsear labs.config.json: ${error.message}`);
    return null;
  }
  pass('labs.config.json parsea como JSON valido.');

  if (!Array.isArray(config.labs) || config.labs.length === 0) {
    fail('labs.config.json no tiene un array "labs" con elementos.');
    return config;
  }
  pass(`Contiene ${config.labs.length} labs.`);

  // Cada lab debe tener id y name.
  const sinId = config.labs.filter((lab) => !lab.id || !lab.name);
  if (sinId.length > 0) {
    fail(`${sinId.length} lab(s) sin id o name.`);
  } else {
    pass('Todos los labs tienen id y name.');
  }

  return config;
}

// (c) Validacion de colision de puertos ──────────────────────────────────────
function checkPorts(config) {
  console.log('\n(c) Puertos declarados');
  if (!config || !Array.isArray(config.labs)) return;

  const seen = new Map(); // port -> id
  let collisions = 0;

  for (const lab of config.labs) {
    if (!lab.port) continue;
    if (seen.has(lab.port)) {
      fail(`Puerto ${lab.port} duplicado entre "${seen.get(lab.port)}" y "${lab.id}".`);
      collisions += 1;
    } else {
      seen.set(lab.port, lab.id);
    }
  }

  // El dashboardPort no debe colisionar con ningun servicio.
  if (config.dashboardPort && seen.has(config.dashboardPort)) {
    fail(`dashboardPort ${config.dashboardPort} colisiona con el lab "${seen.get(config.dashboardPort)}".`);
    collisions += 1;
  }

  if (collisions === 0) {
    pass(`Sin colisiones. ${seen.size} puerto(s) unico(s) declarado(s).`);
  }
}

// (b) Arranque del server y respuesta de /api/overview ───────────────────────
function fetchOverview(port) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { host: '127.0.0.1', port, path: '/api/overview', timeout: 8_000 },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
          } catch (error) {
            reject(new Error(`Respuesta no es JSON: ${error.message}`));
          }
        });
      }
    );
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout al pedir /api/overview.')); });
    req.on('error', reject);
  });
}

async function checkServer() {
  console.log('\n(b) Server + /api/overview');
  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(TEST_PORT, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve();
    });
  });
  pass(`Server escuchando en 127.0.0.1:${TEST_PORT}.`);

  try {
    const { statusCode, body } = await fetchOverview(TEST_PORT);
    if (statusCode !== 200) {
      fail(`/api/overview respondio con status ${statusCode}.`);
    } else {
      pass('/api/overview respondio 200.');
    }
    if (body && Array.isArray(body.labs) && body.labs.length > 0) {
      pass(`/api/overview devolvio ${body.labs.length} labs y totales.`);
    } else {
      fail('/api/overview no devolvio un array "labs" con elementos.');
    }
    if (body && body.totals && typeof body.totals.total === 'number') {
      pass(`Totales presentes (total=${body.totals.total}, services=${body.totals.services}).`);
    } else {
      fail('/api/overview no devolvio bloque "totals".');
    }
  } catch (error) {
    fail(`Error consultando /api/overview: ${error.message}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  console.log('WSL Control Center — verify-localhost');
  console.log(`Puerto de produccion configurado: ${DEFAULT_PORT}`);

  const config = checkConfig();
  checkPorts(config);

  // Solo intentamos arrancar el server si la config es minimamente valida.
  if (config && Array.isArray(config.labs) && config.labs.length > 0) {
    await checkServer();
  } else {
    fail('Se omite la verificacion del server porque la config no es valida.');
  }

  console.log('');
  if (failures === 0) {
    console.log('RESULTADO: OK — todas las verificaciones pasaron.');
    process.exit(0);
  } else {
    console.error(`RESULTADO: FALLO — ${failures} verificacion(es) fallaron.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});
