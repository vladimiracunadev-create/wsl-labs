'use strict';

/*
 * WSL Control Center — servidor del dashboard
 * -------------------------------------------
 * Servidor HTTP escrito SOLO con el modulo `http` nativo de Node (sin express,
 * sin dependencias externas) para que `make serve` y CI funcionen sin npm install.
 *
 * Corre en Windows, sirve el dashboard estatico y controla servicios Linux que
 * viven DENTRO de WSL2 ejecutando:
 *
 *     wsl.exe -d <distro> -- bash -lc "<comando>"
 *
 * La fuente de verdad de puertos/comandos es labs.config.json en la raiz del repo.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

// ── Configuracion base ──────────────────────────────────────────────────────
const REPO_ROOT = process.env.WSL_LABS_ROOT_WIN
  ? path.resolve(process.env.WSL_LABS_ROOT_WIN)
  : path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(REPO_ROOT, 'labs.config.json');
const HOST = '127.0.0.1';

// Token opcional. Si WSL_LABS_TOKEN esta definido, los endpoints /api quedan
// protegidos; sin la variable el acceso es abierto (modo dev local).
const AUTH_TOKEN = process.env.WSL_LABS_TOKEN || null;

// Usuario con el que se ejecutan los comandos dentro de WSL. Por defecto `root`
// (privilegiado sin contraseña, estilo Docker). Se puede sobreescribir por env.
const RUN_USER = process.env.WSL_LABS_USER || 'root';

// Timeouts de ejecucion de comandos WSL (milisegundos).
const EXEC_TIMEOUT_MS = 30_000;   // start/stop pueden tardar (arranque de servicios)
const INSTALL_TIMEOUT_MS = 300_000; // apt install puede tardar minutos
const LOGS_TIMEOUT_MS = 12_000;   // lectura de logs
const HEALTH_TIMEOUT_MS = 2_500;  // health-check HTTP/TCP

// ── Carga de configuracion ──────────────────────────────────────────────────
function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);
  if (!Array.isArray(config.labs)) {
    throw new Error('labs.config.json no contiene un array "labs".');
  }
  return config;
}

// Distro objetivo: viene de la config, pero se puede sobreescribir por env.
function resolveDistro(config) {
  return process.env.WSL_LABS_DISTRO || config.distro || 'Ubuntu';
}

// Convierte una ruta Windows (C:\dev\wsl-labs) a formato WSL (/mnt/c/dev/wsl-labs).
function toWslPath(winPath) {
  return String(winPath)
    .replace(/\\/g, '/')
    .replace(/^([A-Za-z]):/, (_, drive) => `/mnt/${drive.toLowerCase()}`);
}

const WSL_LABS_ROOT = toWslPath(REPO_ROOT);

// ── Tipos MIME para estaticos ───────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// ── Rate limiting nativo (30 req / 60s por IP) ──────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map(); // ip -> { count, resetAt }

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  record.count += 1;
  return record.count > RATE_LIMIT_MAX;
}

// Limpieza periodica para evitar crecimiento indefinido del Map.
const rateLimitSweeper = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS * 2);
// No mantener el proceso vivo solo por este timer.
if (rateLimitSweeper.unref) rateLimitSweeper.unref();

// ── Autenticacion por token ─────────────────────────────────────────────────
function isAuthenticated(req) {
  if (!AUTH_TOKEN) return true; // sin token configurado: acceso abierto (dev)
  const authHeader = req.headers['authorization'] || '';
  const cookieHeader = req.headers['cookie'] || '';
  const fromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const fromCookie = (cookieHeader.match(/(?:^|;\s*)wsl_labs_token=([^;]+)/) || [])[1] || null;
  return fromHeader === AUTH_TOKEN || fromCookie === AUTH_TOKEN;
}

// ── Ejecucion de comandos dentro de WSL ─────────────────────────────────────
// Ejecuta `comando` en WSL resolviendo la ruta del repo.
// IMPORTANTE: a traves de `wsl.exe -- bash -lc`, las variables de shell
// ASIGNADAS dentro del comando (incluido `export VAR=x; ... $VAR`) NO se
// expanden de forma fiable. Por eso NO dependemos de `$WSL_LABS_ROOT` en
// runtime: sustituimos el token por la ruta literal antes de enviar el comando.
function runInWsl(distro, command, timeoutMs = EXEC_TIMEOUT_MS) {
  // Sustitucion literal de $WSL_LABS_ROOT -> /mnt/c/... (sin variables de shell).
  const resolved = String(command).split('$WSL_LABS_ROOT').join(WSL_LABS_ROOT);
  // Se mantiene el export por si algun proceso hijo lo consulta por entorno.
  const wrapped = `export WSL_LABS_ROOT=${shellQuote(WSL_LABS_ROOT)}; ${resolved}`;

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let spawnError = null;

    const finalize = (payload) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(payload);
    };

    let child;
    try {
      // -u root: ejecuta privilegiado SIN pedir contraseña (Windows ya autenticó
      // al usuario). Es el equivalente WSL de cómo Docker corre privilegiado, y
      // evita que los `sudo` interactivos cuelguen las acciones del panel.
      child = spawn('wsl.exe', ['-d', distro, '-u', RUN_USER, '--', 'bash', '-lc', wrapped], {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      });
    } catch (error) {
      finalize({ ok: false, exitCode: 1, output: error.message, stdout: '', stderr: '' });
      return;
    }

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => { spawnError = error; });

    child.on('close', (code) => {
      const output = String(stdout + stderr).trim();
      finalize({
        ok: !spawnError && code === 0,
        exitCode: Number.isInteger(code) ? code : 1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        output: output || (spawnError ? spawnError.message : ''),
      });
    });

    const timer = setTimeout(() => {
      if (child && !child.killed) child.kill();
      finalize({ ok: false, exitCode: 124, output: `Comando cancelado por timeout (${timeoutMs}ms).`, stdout: '', stderr: '' });
    }, timeoutMs);
  });
}

// Escapa un valor para uso seguro dentro de comillas simples en bash.
function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

// Deja solo las ultimas N lineas de un texto (para logs largos).
function takeLastLines(value, maxLines = 80) {
  const lines = String(value || '').split(/\r?\n/).filter((l) => l.length > 0);
  return lines.length <= maxLines ? lines.join('\n') : lines.slice(-maxLines).join('\n');
}

// ── Health-checks ───────────────────────────────────────────────────────────
// Los servicios en WSL pueden bindear IPv4 (0.0.0.0) o IPv6 (::). `curl localhost`
// prueba ambas familias; nuestros checks tambien, para no marcar "stopped" un
// servicio que solo escucha por ::1.
const HEALTH_HOSTS = ['127.0.0.1', '::1'];

function tcpConnectOnce(host, port, timeoutMs) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.once('timeout', () => finish(false));
    socket.connect(port, host);
  });
}

// Comprobacion TCP: abre el puerto probando IPv4 e IPv6.
async function tcpCheck(port, timeoutMs = HEALTH_TIMEOUT_MS) {
  for (const host of HEALTH_HOSTS) {
    if (await tcpConnectOnce(host, port, timeoutMs)) return true;
  }
  return false;
}

function httpGetOnce(host, port, timeoutMs) {
  return new Promise((resolve) => {
    const req = http.get({ host, port, path: '/', timeout: timeoutMs }, (res) => {
      res.resume(); // descartar cuerpo
      resolve(res.statusCode < 500);
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}

// Comprobacion HTTP: GET probando IPv4 e IPv6.
async function httpCheck(port, timeoutMs = HEALTH_TIMEOUT_MS) {
  for (const host of HEALTH_HOSTS) {
    if (await httpGetOnce(host, port, timeoutMs)) return true;
  }
  return false;
}

// Determina el estado de un lab de tipo service:
//   healthy  -> responde correctamente
//   stopped  -> puerto cerrado / sin respuesta
//   degraded -> puerto abierto pero HTTP responde error
async function checkLabHealth(lab) {
  if (lab.type !== 'service' || !lab.port) {
    return { status: 'n/a', detail: 'Lab sin servicio' };
  }

  const portOpen = await tcpCheck(lab.port);
  if (!portOpen) {
    return { status: 'stopped', detail: 'Puerto cerrado' };
  }

  if (lab.healthProtocol === 'http') {
    const ok = await httpCheck(lab.port);
    return ok
      ? { status: 'healthy', detail: 'HTTP OK' }
      : { status: 'degraded', detail: 'Puerto abierto, HTTP con error' };
  }

  // healthProtocol tcp (o cualquier otro): basta con que el puerto acepte conexion.
  return { status: 'healthy', detail: 'Puerto abierto' };
}

// Cache de binarios instalados. La deteccion via wsl.exe puede fallar o expirar
// puntualmente (arranque en frio de WSL, carga), y NO queremos que un servicio
// ya instalado parpadee a "No instalado". Por eso: acumulamos positivos (una vez
// visto instalado, se mantiene) y solo re-sondeamos cada CACHE_TTL.
const INSTALLED_CACHE_TTL_MS = 30_000;
const installedCache = new Set();
let installedCacheAt = 0;

// Detecta que binarios de servicio estan instalados en la distro, en UNA sola
// llamada a wsl.exe (imprime el nombre de cada binario presente). Si wsl.exe no
// existe (p.ej. CI en Linux) devuelve el cache acumulado sin lanzar excepcion.
async function detectInstalled(distro, requiresList) {
  const bins = [...new Set(requiresList.filter(Boolean))];
  if (bins.length === 0) return new Set(installedCache);

  const now = Date.now();
  if (now - installedCacheAt < INSTALLED_CACHE_TTL_MS) {
    return new Set(installedCache); // dentro del TTL: usa el cache
  }

  // IMPORTANTE: no usamos variables de shell (for/$b). Al ejecutar via
  // `wsl.exe -- bash -lc`, las variables ASIGNADAS dentro del comando no se
  // expanden de forma fiable; por eso generamos un check literal por binario.
  // `; true` al final fuerza exit 0 aunque el ultimo binario falte.
  const checks = bins.map(
    (b) => `command -v ${shellQuote(b)} >/dev/null 2>&1 && echo ${shellQuote(b)}`
  );
  const cmd = `${checks.join('; ')}; true`;
  const res = await runInWsl(distro, cmd, HEALTH_TIMEOUT_MS + 2_000);
  if (!res.ok) return new Set(installedCache); // fallo puntual: no invalida el cache

  // Exito: acumulamos positivos en el cache (una vez instalado, se recuerda).
  res.stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((b) => installedCache.add(b));
  installedCacheAt = now;
  return new Set(installedCache);
}

// ── Construccion del overview ───────────────────────────────────────────────
async function buildOverview() {
  const config = loadConfig();
  const distro = resolveDistro(config);

  // Una sola sonda de "instalado" para todos los servicios.
  const installedSet = await detectInstalled(
    distro,
    config.labs.filter((l) => l.type === 'service').map((l) => l.requires)
  );

  const labs = await Promise.all(
    config.labs.map(async (lab) => {
      const health = await checkLabHealth(lab);
      // Un servicio esta "instalado" si su binario aparece, o si ya responde sano.
      const installed =
        lab.type === 'service'
          ? Boolean(lab.requires && installedSet.has(lab.requires)) || health.status === 'healthy'
          : true;
      // Si el servicio no esta instalado y ademas esta parado, el estado real es
      // "missing" (falta instalarlo) — mas honesto que decir "detenido".
      let status = health.status;
      let statusDetail = health.detail;
      if (lab.type === 'service' && !installed && health.status === 'stopped') {
        status = 'missing';
        statusDetail = 'No instalado';
      }
      return {
        id: lab.id,
        name: lab.name,
        path: lab.path,
        type: lab.type,
        description: lab.description || '',
        port: lab.port || null,
        url: lab.url || null,
        healthProtocol: lab.healthProtocol || null,
        requires: lab.requires || null,
        installHint: lab.installHint || null,
        installed,
        hasInstall: Boolean(lab.installCommand),
        hasStart: Boolean(lab.startCommand),
        hasStop: Boolean(lab.stopCommand),
        hasLogs: Boolean(lab.logsCommand),
        // Estado normalizado: healthy | stopped | degraded | missing | n/a
        status,
        statusDetail,
      };
    })
  );

  const services = labs.filter((lab) => lab.type === 'service');
  const totals = {
    total: labs.length,
    services: services.length,
    healthy: services.filter((l) => l.status === 'healthy').length,
    stopped: services.filter((l) => l.status === 'stopped').length,
    degraded: services.filter((l) => l.status === 'degraded').length,
    missing: services.filter((l) => l.status === 'missing').length,
  };

  return {
    generatedAt: new Date().toISOString(),
    project: config.project || 'WSL Control Center',
    subtitle: config.subtitle || '',
    distro,
    totals,
    labs,
  };
}

// ── Utilidades HTTP ─────────────────────────────────────────────────────────
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { error: 'Archivo no encontrado.' });
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(content);
  });
}

const MAX_BODY_BYTES = 8 * 1024; // 8 KB — suficiente para { id }

async function readBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw new Error('Cuerpo de la peticion demasiado grande.');
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('El cuerpo de la peticion no es JSON valido.');
  }
}

// ── Estaticos servidos desde la raiz del repo ───────────────────────────────
const STATIC_FILES = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/dashboard.css', 'dashboard.css'],
  ['/dashboard.js', 'dashboard.js'],
]);

// ── Acciones WSL (start / stop / logs) ──────────────────────────────────────
const ACTION_COMMAND = {
  start: 'startCommand',
  stop: 'stopCommand',
  logs: 'logsCommand',
  install: 'installCommand',
};

async function handleWslAction(action, body) {
  const config = loadConfig();
  const distro = resolveDistro(config);
  const id = body && typeof body.id === 'string' ? body.id : null;

  if (!id || !/^[\w-]+$/.test(id)) {
    return { statusCode: 400, payload: { ok: false, error: 'Parametro "id" invalido o ausente.' } };
  }

  const lab = config.labs.find((item) => item.id === id);
  if (!lab) {
    return { statusCode: 404, payload: { ok: false, error: 'Lab no encontrado.' } };
  }

  const commandKey = ACTION_COMMAND[action];
  const command = lab[commandKey];
  if (!command) {
    return { statusCode: 400, payload: { ok: false, error: `El lab ${id} no define ${commandKey}.` } };
  }

  const timeout =
    action === 'logs' ? LOGS_TIMEOUT_MS : action === 'install' ? INSTALL_TIMEOUT_MS : EXEC_TIMEOUT_MS;
  const result = await runInWsl(distro, command, timeout);
  const output = action === 'logs' ? takeLastLines(result.output || '(sin output)') : (result.output || '(sin output)');

  return {
    statusCode: result.ok ? 200 : 500,
    payload: {
      ok: result.ok,
      id,
      action,
      exitCode: result.exitCode,
      output,
    },
  };
}

// ── Router de API ───────────────────────────────────────────────────────────
async function handleApi(req, res, pathname) {
  // GET /api/overview
  if (pathname === '/api/overview' && req.method === 'GET') {
    sendJson(res, 200, await buildOverview());
    return;
  }

  // GET /api/health/:id
  const healthMatch = pathname.match(/^\/api\/health\/([\w-]+)$/);
  if (healthMatch && req.method === 'GET') {
    const config = loadConfig();
    const lab = config.labs.find((item) => item.id === healthMatch[1]);
    if (!lab) {
      sendJson(res, 404, { error: 'Lab no encontrado.' });
      return;
    }
    const health = await checkLabHealth(lab);
    sendJson(res, 200, {
      id: lab.id,
      name: lab.name,
      port: lab.port || null,
      status: health.status,
      detail: health.detail,
      checkedAt: new Date().toISOString(),
    });
    return;
  }

  // POST /api/wsl/start | /api/wsl/stop | /api/wsl/logs | /api/wsl/install
  const wslMatch = pathname.match(/^\/api\/wsl\/(start|stop|logs|install)$/);
  if (wslMatch && req.method === 'POST') {
    const body = await readBody(req);
    const { statusCode, payload } = await handleWslAction(wslMatch[1], body);
    sendJson(res, statusCode, payload);
    return;
  }

  sendJson(res, 404, { error: 'Ruta no encontrada.' });
}

// ── Servidor HTTP ───────────────────────────────────────────────────────────
function createServer() {
  return http.createServer(async (req, res) => {
    if (!req.url) {
      sendJson(res, 400, { error: 'Peticion invalida.' });
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    const pathname = url.pathname;
    const clientIp = req.socket.remoteAddress || 'unknown';

    try {
      if (pathname.startsWith('/api/')) {
        // Autenticacion (si hay token configurado).
        if (!isAuthenticated(req)) {
          sendJson(res, 401, { error: 'No autorizado. Incluye Authorization: Bearer <token>.' });
          return;
        }
        // Rate limit solo en acciones POST.
        if (req.method === 'POST' && isRateLimited(clientIp)) {
          sendJson(res, 429, { error: 'Demasiadas solicitudes. Espera un momento.' });
          return;
        }
        await handleApi(req, res, pathname);
        return;
      }

      // Estaticos.
      const staticRel = STATIC_FILES.get(pathname);
      if (staticRel) {
        sendFile(res, path.join(REPO_ROOT, staticRel));
        return;
      }

      sendJson(res, 404, { error: 'No encontrado.' });
    } catch (error) {
      sendJson(res, 500, { error: 'Error interno del servidor.', detail: error.message });
    }
  });
}

const PORT = Number(process.env.PORT || 9092);

// ── Keepalive de la instancia WSL ───────────────────────────────────────────
// WSL2 apaga la distro tras unos segundos de inactividad; eso tumbaria los
// servicios levantados. Mientras el Control Center corre, mantenemos una sesion
// abierta (`sleep infinity`) para que la instancia siga viva y los puertos
// sigan accesibles desde localhost — igual que Docker Desktop mantiene su VM.
let keepAliveChild = null;
function startKeepAlive(distro) {
  try {
    keepAliveChild = spawn('wsl.exe', ['-d', distro, '--', 'sleep', 'infinity'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    keepAliveChild.on('error', () => { keepAliveChild = null; });
  } catch {
    keepAliveChild = null;
  }
}
function stopKeepAlive() {
  if (keepAliveChild && !keepAliveChild.killed) {
    try { keepAliveChild.kill(); } catch { /* noop */ }
  }
  keepAliveChild = null;
}

// Arranque solo si se ejecuta directamente (permite importar en verify-localhost).
if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    const distro = resolveDistro(loadConfig());
    startKeepAlive(distro);
    console.log('\n  WSL Control Center');
    console.log(`  http://localhost:${PORT}`);
    console.log(`  Repo (Windows): ${REPO_ROOT}`);
    console.log(`  Repo (WSL):     ${WSL_LABS_ROOT}`);
    console.log(`  Distro:         ${distro} (keepalive activo)`);
    console.log(`  Auth token:     ${AUTH_TOKEN ? 'activado' : 'desactivado (modo dev)'}\n`);
  });
  for (const sig of ['SIGINT', 'SIGTERM', 'exit']) {
    process.on(sig, () => { stopKeepAlive(); if (sig !== 'exit') process.exit(0); });
  }
}

module.exports = {
  createServer,
  buildOverview,
  checkLabHealth,
  loadConfig,
  resolveDistro,
  toWslPath,
  takeLastLines,
  shellQuote,
  PORT,
  REPO_ROOT,
  WSL_LABS_ROOT,
};
