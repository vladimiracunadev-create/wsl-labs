/*
 * WSL Container Center — lógica del panel (vanilla JS, sin frameworks)
 * -------------------------------------------------------------------
 * - Hace fetch a /api/wslc/overview y pinta las tarjetas de cada CASO.
 * - Los botones llaman a /api/wslc/{build,up,down,logs} con body { id }.
 * - Tras cada acción refresca el overview.
 */

const state = { cases: [] };

const els = {
  total: document.getElementById('metric-total'),
  running: document.getElementById('metric-running'),
  stopped: document.getElementById('metric-stopped'),
  engine: document.getElementById('metric-engine'),
  generatedAt: document.getElementById('generated-at'),
  subtitle: document.getElementById('hero-subtitle'),
  grid: document.getElementById('wslc-grid'),
  logsTitle: document.getElementById('logs-title'),
  logsOutput: document.getElementById('logs-output'),
  refresh: document.getElementById('refresh-all'),
  upAll: document.getElementById('up-all'),
  downAll: document.getElementById('down-all'),
};

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function safeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : '#';
}

function formatTimestamp(value) {
  return value ? new Date(value).toLocaleString('es-CL') : 'sin datos';
}

function statusMeta(status) {
  const map = {
    running: { label: '✅ Corriendo', cls: 'healthy' },
    degraded: { label: '⚠️ Arrancando', cls: 'degraded' },
    stopped: { label: '⏹ Detenido', cls: 'stopped' },
    missing: { label: '📦 Sin imagen', cls: 'missing' },
    unavailable: { label: '🚫 No disponible', cls: 'missing' },
  };
  return map[status] || { label: esc(status), cls: 'na' };
}

// ── Render ──────────────────────────────────────────────────────────────────
function renderMetrics(overview) {
  els.total.textContent = overview.totals ? overview.totals.total : 0;
  els.running.textContent = overview.totals ? overview.totals.running : 0;
  els.stopped.textContent = overview.totals ? overview.totals.stopped : 0;
  els.engine.textContent = overview.available ? 'wslc ✅' : 'wslc ✗';
  els.generatedAt.textContent = `Última lectura: ${formatTimestamp(overview.generatedAt)}`;
  if (overview.subtitle) els.subtitle.textContent = overview.subtitle;
}

function renderCases(overview) {
  if (!overview.available) {
    els.grid.innerHTML =
      `<div class="empty">🚫 <b>WSLC no está disponible.</b> ` +
      `${esc(overview.hint || 'Actualiza WSL: wsl --update --pre-release')}</div>`;
    return;
  }
  if (!overview.cases || !overview.cases.length) {
    els.grid.innerHTML = `<div class="empty">Sin casos en el catálogo.</div>`;
    return;
  }

  els.grid.innerHTML = overview.cases
    .map((c) => {
      const id = esc(c.id);
      const meta = statusMeta(c.status);

      const tags = [`<span class="tag">${esc(c.category)}</span>`];
      if (c.port) tags.push(`<span class="tag">🔌 :${esc(c.port)}</span>`);
      if (c.multi) tags.push(`<span class="tag">🧩 multi</span>`);
      (c.images || []).forEach((img) => tags.push(`<span class="tag">🏷️ ${esc(img)}</span>`));

      const actions = [];
      if (c.status === 'missing') {
        actions.push(`<button class="btn btn-primary" data-wslc-action="build" data-id="${id}" title="wslc build (puede tardar)">📦 Construir</button>`);
      } else {
        if (c.status !== 'running') {
          actions.push(`<button class="btn btn-primary" data-wslc-action="up" data-id="${id}">▶ Levantar</button>`);
        } else {
          actions.push(`<button class="btn btn-danger" data-wslc-action="down" data-id="${id}">⏹ Bajar</button>`);
          actions.push(`<button class="btn btn-ghost" data-wslc-action="logs" data-id="${id}">📄 Logs</button>`);
        }
        if (c.needsBuild) {
          actions.push(`<button class="btn btn-ghost" data-wslc-action="build" data-id="${id}" title="Reconstruir imagen">🔁 Rebuild</button>`);
        }
      }
      if (c.url && c.status === 'running') {
        actions.push(`<a class="btn btn-secondary" href="${safeUrl(c.url)}" target="_blank" rel="noreferrer">🌐 Abrir</a>`);
      }

      return `
        <article class="lab-card ${meta.cls}">
          <div class="lab-head">
            <div>
              <div class="lab-id">Caso ${id}</div>
              <h3 class="lab-title">${esc(c.title)}</h3>
            </div>
            <span class="status-badge ${meta.cls}">
              <span class="status-dot"></span>
              <span>${meta.label}</span>
            </span>
          </div>
          <p class="lab-copy">${esc(c.description)}</p>
          <div class="tag-row">${tags.join('')}</div>
          <div class="card-actions">${actions.join('')}</div>
        </article>
      `;
    })
    .join('');
}

// ── Fetch con timeout ───────────────────────────────────────────────────────
async function fetchJson(url, options = {}) {
  const isAction = options.method === 'POST';
  const timeoutMs = isAction ? 320_000 : 15_000; // build/up pueden tardar minutos
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'La petición falló.');
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error(`Timeout: sin respuesta en ${timeoutMs / 1000}s.`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function loadOverview() {
  const overview = await fetchJson('/api/wslc/overview');
  state.cases = overview.cases || [];
  renderMetrics(overview);
  renderCases(overview);
  return overview;
}

async function runAction(id, action) {
  const verbo = { build: 'construyendo', up: 'levantando', down: 'bajando', logs: 'logs de' }[action] || action;
  els.logsTitle.textContent = `Caso ${id} · ${action}`;
  els.logsOutput.textContent = `wslc: ${verbo} "${id}"… (build/up pueden tardar unos minutos)`;
  const payload = await fetchJson(`/api/wslc/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  els.logsOutput.textContent = payload.output || 'Acción completada sin salida adicional.';
  if (action !== 'logs') await loadOverview();
}

// ── Clicks ──────────────────────────────────────────────────────────────────
document.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-wslc-action]');
  if (!target) return;
  const id = target.getAttribute('data-id');
  const action = target.getAttribute('data-wslc-action');
  if (!id || !action) return;
  try {
    target.disabled = true;
    await runAction(id, action);
  } catch (error) {
    els.logsOutput.textContent = error.message;
  } finally {
    target.disabled = false;
  }
});

els.refresh.addEventListener('click', async () => {
  try { await loadOverview(); } catch (error) { els.logsOutput.textContent = error.message; }
});

els.upAll.addEventListener('click', async () => {
  const ready = state.cases.filter((c) => c.status === 'stopped');
  els.logsTitle.textContent = 'Levantar todo';
  els.logsOutput.textContent = `Levantando ${ready.length} caso(s) listos… (los que necesiten build, constrúyelos antes)`;
  for (const c of ready) {
    try { await runAction(c.id, 'up'); } catch (error) { els.logsOutput.textContent = `Fallo en ${c.id}: ${error.message}`; break; }
  }
  await loadOverview().catch(() => {});
});

els.downAll.addEventListener('click', async () => {
  if (!window.confirm('¿Bajar todos los contenedores en ejecución?')) return;
  const running = state.cases.filter((c) => c.status === 'running');
  els.logsTitle.textContent = 'Bajar todo';
  els.logsOutput.textContent = `Bajando ${running.length} caso(s)…`;
  for (const c of running) {
    try { await runAction(c.id, 'down'); } catch (error) { els.logsOutput.textContent = `Fallo en ${c.id}: ${error.message}`; break; }
  }
  await loadOverview().catch(() => {});
});

// ── Arranque ────────────────────────────────────────────────────────────────
loadOverview().catch((error) => { els.logsOutput.textContent = error.message; });
