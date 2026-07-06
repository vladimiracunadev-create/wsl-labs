'use strict';

/*
 * WSL Container Center — servidor del panel
 * -----------------------------------------
 * Servidor HTTP con el módulo `http` nativo (sin dependencias npm). Corre en
 * Windows y controla CONTENEDORES con `wslc.exe` (el motor de contenedores
 * nativo de WSL). La fuente de verdad es containers/containers.config.json.
 *
 * Endpoints: GET /api/wslc/overview · POST /api/wslc/{build,up,down,logs}
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

// ── Configuración base ──────────────────────────────────────────────────────
const REPO_ROOT = process.env.WSL_LABS_ROOT_WIN
  ? path.resolve(process.env.WSL_LABS_ROOT_WIN)
  : path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(REPO_ROOT, 'containers', 'containers.config.json');
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 9092);

// Token opcional: si WSL_LABS_TOKEN está definido, /api queda protegido.
const AUTH_TOKEN = process.env.WSL_LABS_TOKEN || null;

// Timeouts de ejecución de wslc (ms).
const EXEC_TIMEOUT_MS = 30_000;
const BUILD_TIMEOUT_MS = 600_000; // build/up pueden tardar (pull + capas + arranque)
const LOGS_TIMEOUT_MS = 12_000;
const HEALTH_TIMEOUT_MS = 3_000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// ── Rate limit (solo acciones POST) ─────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map();

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

const rateLimitSweeper = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS * 2);
if (rateLimitSweeper.unref) rateLimitSweeper.unref();

// ── Autenticación por token ─────────────────────────────────────────────────
function isAuthenticated(req) {
  if (!AUTH_TOKEN) return true;
  const authHeader = req.headers['authorization'] || '';
  const cookieHeader = req.headers['cookie'] || '';
  const fromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const fromCookie = (cookieHeader.match(/(?:^|;\s*)wsl_labs_token=([^;]+)/) || [])[1] || null;
  return fromHeader === AUTH_TOKEN || fromCookie === AUTH_TOKEN;
}

// ── Utilidades ──────────────────────────────────────────────────────────────
function takeLastLines(value, maxLines = 80) {
  const lines = String(value || '').split(/\r?\n/).filter((l) => l.length > 0);
  return lines.length <= maxLines ? lines.join('\n') : lines.slice(-maxLines).join('\n');
}

// ── Health-checks (IPv4 + IPv6, como curl) ──────────────────────────────────
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

async function tcpCheck(port, timeoutMs = HEALTH_TIMEOUT_MS) {
  for (const host of HEALTH_HOSTS) {
    if (await tcpConnectOnce(host, port, timeoutMs)) return true;
  }
  return false;
}

function httpGetOnce(host, port, timeoutMs) {
  return new Promise((resolve) => {
    const req = http.get({ host, port, path: '/', timeout: timeoutMs }, (res) => {
      res.resume();
      resolve(res.statusCode < 500);
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}

async function httpCheck(port, timeoutMs = HEALTH_TIMEOUT_MS) {
  for (const host of HEALTH_HOSTS) {
    if (await httpGetOnce(host, port, timeoutMs)) return true;
  }
  return false;
}

// ── Ejecución de wslc.exe (en Windows) ──────────────────────────────────────
let wslcPathCache;

function resolveWslcPath() {
  if (wslcPathCache !== undefined) return wslcPathCache;
  const candidates = [process.env.WSL_LABS_WSLC, 'C:\\Program Files\\WSL\\wslc.exe'].filter(Boolean);
  for (const c of candidates) {
    try { if (fs.existsSync(c)) { wslcPathCache = c; return c; } } catch { /* noop */ }
  }
  wslcPathCache = 'wslc.exe'; // último recurso: PATH
  return wslcPathCache;
}

function runWslc(args, timeoutMs = EXEC_TIMEOUT_MS) {
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
      child = spawn(resolveWslcPath(), args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    } catch (error) {
      finalize({ ok: false, exitCode: 1, output: error.message, stdout: '', stderr: '' });
      return;
    }
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (c) => { stdout += c; });
    child.stderr.on('data', (c) => { stderr += c; });
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
      finalize({ ok: false, exitCode: 124, output: `wslc cancelado por timeout (${timeoutMs}ms).`, stdout: '', stderr: '' });
    }, timeoutMs);
  });
}

// ── Catálogo de casos ───────────────────────────────────────────────────────
function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);
  if (!Array.isArray(config.cases)) throw new Error('containers.config.json no contiene "cases".');
  return config;
}

// El contenedor "principal" de un caso es el que publica el puerto del caso.
function primaryContainer(c) {
  const list = c.containers || [];
  return (
    list.find((k) => (k.ports || []).some((p) => String(p).startsWith(`${c.port}:`))) ||
    list[list.length - 1]
  );
}

// ── Overview: motor disponible + estado por caso ────────────────────────────
async function buildOverview() {
  let config;
  try { config = loadConfig(); } catch (e) {
    return { available: false, engine: 'wslc', reason: e.message, cases: [], totals: { total: 0 } };
  }
  const ver = await runWslc(['version'], 5_000);
  const available = ver.ok;

  const imagesText = available ? (await runWslc(['images'], 8_000)).stdout || '' : '';
  const listText = available ? (await runWslc(['list'], 8_000)).stdout || '' : '';

  const cases = await Promise.all(
    config.cases.map(async (c) => {
      const builds = c.build || [];
      const needsBuild = builds.length > 0;
      const built = !needsBuild || builds.every((b) => imagesText.includes(String(b.image).split(':')[0]));
      const prim = primaryContainer(c);
      const running = available && prim && new RegExp(`\\b${prim.name}\\b`).test(listText);
      let status = 'unavailable';
      let statusDetail = 'WSLC no disponible';
      if (available) {
        if (running) {
          const ok = c.healthProtocol === 'tcp' ? await tcpCheck(c.port) : await httpCheck(c.port);
          status = ok ? 'running' : 'degraded';
          statusDetail = ok ? 'Contenedor(es) arriba' : 'Arrancando…';
        } else if (needsBuild && !built) {
          status = 'missing';
          statusDetail = 'Imagen sin construir';
        } else {
          status = 'stopped';
          statusDetail = 'Listo para levantar';
        }
      }
      return {
        id: c.id,
        name: c.name,
        title: c.title || c.name,
        description: c.description || '',
        category: c.category || 'starter',
        port: c.port || null,
        url: c.url || null,
        images: (c.containers || []).map((k) => k.image),
        multi: (c.containers || []).length > 1,
        needsBuild,
        built,
        running,
        status,
        statusDetail,
      };
    })
  );

  return {
    available,
    engine: 'wslc',
    project: config.project || 'WSL Container Center',
    subtitle: config.subtitle || '',
    wslcPath: resolveWslcPath(),
    hint: available ? null : 'wslc no encontrado. Actualiza WSL: wsl --update --pre-release',
    generatedAt: new Date().toISOString(),
    cases,
    totals: {
      total: cases.length,
      running: cases.filter((c) => c.status === 'running').length,
      stopped: cases.filter((c) => c.status === 'stopped').length,
      missing: cases.filter((c) => c.status === 'missing').length,
    },
  };
}

// ── Acciones sobre un caso: build | up | down | logs ────────────────────────
async function handleAction(action, body) {
  const config = loadConfig();
  const id = body && typeof body.id === 'string' ? body.id : null;
  if (!id || !/^[\w-]+$/.test(id)) {
    return { statusCode: 400, payload: { ok: false, error: 'Parametro "id" invalido o ausente.' } };
  }
  const c = config.cases.find((k) => k.id === id);
  if (!c) return { statusCode: 404, payload: { ok: false, error: 'Caso no encontrado.' } };

  if (action === 'build') {
    const builds = c.build || [];
    if (!builds.length) {
      return { statusCode: 200, payload: { ok: true, id, action, output: 'Caso con imágenes públicas: no requiere build.' } };
    }
    let out = '';
    for (const b of builds) {
      const r = await runWslc(['build', '-t', b.image, path.join(REPO_ROOT, b.context)], BUILD_TIMEOUT_MS);
      out += `[build ${b.image}] ${r.ok ? 'OK' : 'FALLO'}\n${r.output || ''}\n`;
      if (!r.ok) return { statusCode: 500, payload: { ok: false, id, action, output: out.trim() } };
    }
    return { statusCode: 200, payload: { ok: true, id, action, output: out.trim() } };
  }

  if (action === 'up') {
    if (c.network) await runWslc(['network', 'create', c.network], 15_000); // si ya existe, se ignora
    let out = '';
    for (const k of c.containers || []) {
      await runWslc(['stop', k.name], 15_000);
      await runWslc(['rm', k.name], 15_000);
      const args = ['run', '-d', '--name', k.name];
      if (c.network) args.push('--network', c.network);
      for (const p of k.ports || []) args.push('-p', p);
      for (const e of k.env || []) args.push('-e', e);
      args.push(k.image);
      const r = await runWslc(args, BUILD_TIMEOUT_MS);
      out += `[run ${k.name}] ${r.ok ? 'OK' : 'FALLO'}\n${r.output || ''}\n`;
      if (!r.ok) return { statusCode: 500, payload: { ok: false, id, action, output: out.trim() } };
    }
    return { statusCode: 200, payload: { ok: true, id, action, output: out.trim() } };
  }

  if (action === 'down') {
    let out = '';
    for (const k of c.containers || []) {
      await runWslc(['stop', k.name], 20_000);
      const r = await runWslc(['rm', k.name], 20_000);
      out += `[rm ${k.name}] ${r.ok ? 'OK' : '-'}\n`;
    }
    if (c.network) await runWslc(['network', 'rm', c.network], 15_000);
    return { statusCode: 200, payload: { ok: true, id, action, output: out.trim() || '(sin output)' } };
  }

  if (action === 'logs') {
    const prim = primaryContainer(c);
    const r = await runWslc(['logs', prim.name], LOGS_TIMEOUT_MS);
    return { statusCode: 200, payload: { ok: r.ok, id, action, output: takeLastLines(r.output || '(sin output)') } };
  }

  return { statusCode: 400, payload: { ok: false, error: `Accion "${action}" no soportada.` } };
}

// ── HTTP helpers ────────────────────────────────────────────────────────────
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) { sendJson(res, 404, { error: 'Archivo no encontrado.' }); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(content);
  });
}

const MAX_BODY_BYTES = 8 * 1024;

async function readBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw new Error('Cuerpo de la peticion demasiado grande.');
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('El cuerpo de la peticion no es JSON valido.'); }
}

const STATIC_FILES = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/dashboard.css', 'dashboard.css'],
  ['/dashboard.js', 'dashboard.js'],
]);

// ── Router de API ───────────────────────────────────────────────────────────
async function handleApi(req, res, pathname) {
  if (pathname === '/api/wslc/overview' && req.method === 'GET') {
    sendJson(res, 200, await buildOverview());
    return;
  }
  const match = pathname.match(/^\/api\/wslc\/(build|up|down|logs)$/);
  if (match && req.method === 'POST') {
    const body = await readBody(req);
    const { statusCode, payload } = await handleAction(match[1], body);
    sendJson(res, statusCode, payload);
    return;
  }
  sendJson(res, 404, { error: 'Ruta no encontrada.' });
}

// ── Servidor HTTP ───────────────────────────────────────────────────────────
function createServer() {
  return http.createServer(async (req, res) => {
    if (!req.url) { sendJson(res, 400, { error: 'Peticion invalida.' }); return; }
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    const pathname = url.pathname;
    const clientIp = req.socket.remoteAddress || 'unknown';
    try {
      if (pathname.startsWith('/api/')) {
        if (!isAuthenticated(req)) { sendJson(res, 401, { error: 'No autorizado. Incluye Authorization: Bearer <token>.' }); return; }
        if (req.method === 'POST' && isRateLimited(clientIp)) { sendJson(res, 429, { error: 'Demasiadas solicitudes. Espera un momento.' }); return; }
        await handleApi(req, res, pathname);
        return;
      }
      const staticRel = STATIC_FILES.get(pathname);
      if (staticRel) { sendFile(res, path.join(REPO_ROOT, staticRel)); return; }
      sendJson(res, 404, { error: 'No encontrado.' });
    } catch (error) {
      sendJson(res, 500, { error: 'Error interno del servidor.', detail: error.message });
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log('\n  WSL Container Center');
    console.log(`  http://localhost:${PORT}`);
    console.log(`  Repo:      ${REPO_ROOT}`);
    console.log(`  Motor:     ${resolveWslcPath()}`);
    console.log(`  Auth token:${AUTH_TOKEN ? ' activado' : ' desactivado (modo dev)'}\n`);
  });
}

module.exports = { createServer, buildOverview, handleAction, loadConfig, resolveWslcPath };
