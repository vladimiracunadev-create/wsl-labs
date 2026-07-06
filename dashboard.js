/*
 * WSL Control Center — logica del dashboard (vanilla JS, sin frameworks)
 * ---------------------------------------------------------------------
 * - Hace fetch a /api/overview y pinta metricas + tarjetas de lab.
 * - Los botones llaman a /api/wsl/{start,stop,logs} con body { id }.
 * - Tras cada accion refresca el overview para actualizar el estado.
 */

const state = {
  labs: [],
  distro: '—',
};

const els = {
  total: document.getElementById('metric-total'),
  healthy: document.getElementById('metric-healthy'),
  stopped: document.getElementById('metric-stopped'),
  distro: document.getElementById('metric-distro'),
  generatedAt: document.getElementById('generated-at'),
  subtitle: document.getElementById('hero-subtitle'),
  labGrid: document.getElementById('lab-grid'),
  logsTitle: document.getElementById('logs-title'),
  logsOutput: document.getElementById('logs-output'),
  refresh: document.getElementById('refresh-all'),
  startAll: document.getElementById('start-all'),
  stopAll: document.getElementById('stop-all'),
};

// Escapa texto para evitar inyeccion al insertarlo en innerHTML.
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Solo deja pasar URLs http/https.
function safeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : '#';
}

function formatTimestamp(value) {
  return value ? new Date(value).toLocaleString('es-CL') : 'sin datos';
}

// Etiqueta legible + clase CSS por estado.
function statusMeta(status) {
  const map = {
    healthy: { label: '✅ Saludable', cls: 'healthy' },
    degraded: { label: '⚠️ Degradado', cls: 'degraded' },
    stopped: { label: '⏹ Detenido', cls: 'stopped' },
    'n/a': { label: '📘 Learning', cls: 'na' },
  };
  return map[status] || { label: esc(status), cls: 'na' };
}

// ── Render de metricas ──────────────────────────────────────────────────────
function renderMetrics(overview) {
  els.total.textContent = overview.totals.services;
  els.healthy.textContent = overview.totals.healthy;
  els.stopped.textContent = overview.totals.stopped;
  els.distro.textContent = overview.distro || '—';
  els.generatedAt.textContent = `Última lectura: ${formatTimestamp(overview.generatedAt)}`;
  if (overview.subtitle) {
    els.subtitle.textContent = overview.subtitle;
  }
}

// ── Render de tarjetas ──────────────────────────────────────────────────────
function renderLabCards() {
  if (!state.labs.length) {
    els.labGrid.innerHTML = `<div class="empty">No hay laboratorios registrados.</div>`;
    return;
  }

  els.labGrid.innerHTML = state.labs
    .map((lab) => {
      const id = esc(lab.id);
      const meta = statusMeta(lab.status);
      const isService = lab.type === 'service';

      // Fila de metadatos (tipo + puerto + protocolo de salud).
      const tags = [`<span class="tag">${esc(lab.type)}</span>`];
      if (lab.port) tags.push(`<span class="tag">🔌 :${esc(lab.port)}</span>`);
      if (lab.healthProtocol) tags.push(`<span class="tag">🩺 ${esc(lab.healthProtocol)}</span>`);

      // Botones: solo los servicios con comando disponible muestran controles.
      const actions = [];
      if (isService && lab.hasStart) {
        actions.push(`<button class="btn btn-primary" data-action="start" data-id="${id}">▶ Levantar</button>`);
      }
      if (isService && lab.hasStop) {
        actions.push(`<button class="btn btn-danger" data-action="stop" data-id="${id}">⏹ Detener</button>`);
      }
      if (isService && lab.hasLogs) {
        actions.push(`<button class="btn btn-ghost" data-action="logs" data-id="${id}">📄 Logs</button>`);
      }
      if (lab.url) {
        actions.push(`<a class="btn btn-secondary" href="${safeUrl(lab.url)}" target="_blank" rel="noreferrer">🌐 Abrir</a>`);
      }
      if (!actions.length) {
        actions.push(`<span class="lab-meta">Lab de aprendizaje — ver documentación.</span>`);
      }

      return `
        <article class="lab-card ${meta.cls}">
          <div class="lab-head">
            <div>
              <div class="lab-id">Lab ${id}</div>
              <h3 class="lab-title">${esc(lab.name)}</h3>
            </div>
            <span class="status-badge ${meta.cls}">
              <span class="status-dot"></span>
              <span>${meta.label}</span>
            </span>
          </div>
          <p class="lab-copy">${esc(lab.description)}</p>
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
  const timeoutMs = isAction ? 40_000 : 15_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'La petición falló.');
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout: el servidor no respondió en ${timeoutMs / 1000}s.`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// ── Carga del overview ──────────────────────────────────────────────────────
async function loadOverview() {
  const overview = await fetchJson('/api/overview');
  state.labs = overview.labs;
  state.distro = overview.distro;
  renderMetrics(overview);
  renderLabCards();
}

// ── Acciones sobre un lab ───────────────────────────────────────────────────
async function runWslAction(id, action) {
  els.logsTitle.textContent = `Salida operativa: lab ${id} (${action})`;
  els.logsOutput.textContent = `Ejecutando "${action}" en WSL…`;
  const payload = await fetchJson(`/api/wsl/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  els.logsOutput.textContent = payload.output || 'Acción completada sin salida adicional.';
  if (action !== 'logs') {
    await loadOverview();
  }
}

// ── Delegacion de clicks en las tarjetas ────────────────────────────────────
document.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const id = target.getAttribute('data-id');
  const action = target.getAttribute('data-action');
  if (!id || !action) return;

  try {
    target.disabled = true;
    await runWslAction(id, action);
  } catch (error) {
    els.logsOutput.textContent = error.message;
  } finally {
    target.disabled = false;
  }
});

// ── Acciones globales ───────────────────────────────────────────────────────
els.refresh.addEventListener('click', async () => {
  try {
    await loadOverview();
  } catch (error) {
    els.logsOutput.textContent = error.message;
  }
});

els.startAll.addEventListener('click', async () => {
  const services = state.labs.filter((lab) => lab.type === 'service' && lab.hasStart);
  els.logsTitle.textContent = 'Salida operativa: levantar todo';
  els.logsOutput.textContent = 'Levantando todos los servicios uno por uno…';
  for (const lab of services) {
    try {
      await runWslAction(lab.id, 'start');
    } catch (error) {
      els.logsOutput.textContent = `Fallo al levantar ${lab.id}: ${error.message}`;
      break;
    }
  }
  await loadOverview().catch(() => {});
});

els.stopAll.addEventListener('click', async () => {
  if (!window.confirm('¿Bajar todos los servicios Linux de este repositorio?')) return;
  const services = state.labs.filter((lab) => lab.type === 'service' && lab.hasStop);
  els.logsTitle.textContent = 'Salida operativa: bajar todo';
  els.logsOutput.textContent = 'Deteniendo todos los servicios…';
  for (const lab of services) {
    try {
      await runWslAction(lab.id, 'stop');
    } catch (error) {
      els.logsOutput.textContent = `Fallo al detener ${lab.id}: ${error.message}`;
      break;
    }
  }
  await loadOverview().catch(() => {});
});

// ── Arranque ────────────────────────────────────────────────────────────────
loadOverview().catch((error) => {
  els.logsOutput.textContent = error.message;
});
