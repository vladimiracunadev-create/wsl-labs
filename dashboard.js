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
  wslcGrid: document.getElementById('wslc-grid'),
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
    running: { label: '✅ Corriendo', cls: 'healthy' },
    degraded: { label: '⚠️ Degradado', cls: 'degraded' },
    stopped: { label: '⏹ Detenido', cls: 'stopped' },
    missing: { label: '⛔ No instalado', cls: 'missing' },
    unavailable: { label: '🚫 WSLC no disponible', cls: 'missing' },
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
      // Si falta instalarlo, el botón principal es "Instalar" (corre el script
      // como root en WSL, sin contraseña — estilo Docker).
      if (isService && lab.status === 'missing' && lab.hasInstall) {
        actions.push(`<button class="btn btn-primary" data-action="install" data-id="${id}" title="Instala el servicio en WSL (puede tardar 1-2 min)">📦 Instalar</button>`);
      }
      if (isService && lab.hasStart && lab.status !== 'missing') {
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

      // Si el servicio no está instalado, muestra cómo instalarlo (es más honesto
      // que dejar un botón "Levantar" que fallaría).
      const installNote =
        lab.status === 'missing' && lab.installHint
          ? `<div class="install-hint">📦 Instálalo primero: <code>${esc(lab.installHint)}</code></div>`
          : '';

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
          ${installNote}
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

// ── Contenedores WSLC ───────────────────────────────────────────────────────
function wslcStatusMeta(status) {
  const map = {
    running: { label: '✅ Corriendo', cls: 'healthy' },
    degraded: { label: '⚠️ Degradado', cls: 'degraded' },
    stopped: { label: '⏹ Detenido', cls: 'stopped' },
    missing: { label: '⛔ Sin imagen', cls: 'missing' },
    unavailable: { label: '🚫 No disponible', cls: 'missing' },
  };
  return map[status] || { label: esc(status), cls: 'na' };
}

function renderWslcCards(overview) {
  if (!overview.available) {
    els.wslcGrid.innerHTML =
      `<div class="empty">🚫 <b>WSLC no está disponible.</b> ` +
      `${esc(overview.hint || 'Actualiza WSL: wsl --update --pre-release')}</div>`;
    return;
  }
  if (!overview.images || !overview.images.length) {
    els.wslcGrid.innerHTML = `<div class="empty">Sin imágenes en el catálogo WSLC.</div>`;
    return;
  }

  els.wslcGrid.innerHTML = overview.images
    .map((img) => {
      const id = esc(img.id);
      const meta = wslcStatusMeta(img.status);
      const tags = [`<span class="tag">🐳 contenedor</span>`];
      if (img.port) tags.push(`<span class="tag">🔌 :${esc(img.port)}</span>`);
      tags.push(`<span class="tag">🏷️ ${esc(img.image)}</span>`);

      const actions = [];
      if (img.status === 'missing') {
        actions.push(`<button class="btn btn-primary" data-wslc-action="build" data-id="${id}" title="Construye la imagen (wslc build; puede tardar)">📦 Construir</button>`);
      } else {
        if (img.status !== 'running') {
          actions.push(`<button class="btn btn-primary" data-wslc-action="run" data-id="${id}">▶ Ejecutar</button>`);
        }
        if (img.status === 'running') {
          actions.push(`<button class="btn btn-danger" data-wslc-action="stop" data-id="${id}">⏹ Detener</button>`);
          actions.push(`<button class="btn btn-ghost" data-wslc-action="logs" data-id="${id}">📄 Logs</button>`);
        }
        actions.push(`<button class="btn btn-ghost" data-wslc-action="build" data-id="${id}" title="Reconstruir la imagen">🔁 Rebuild</button>`);
      }
      if (img.url && img.status === 'running') {
        actions.push(`<a class="btn btn-secondary" href="${safeUrl(img.url)}" target="_blank" rel="noreferrer">🌐 Abrir</a>`);
      }

      return `
        <article class="lab-card ${meta.cls}">
          <div class="lab-head">
            <div>
              <div class="lab-id">Imagen ${id}</div>
              <h3 class="lab-title">${esc(img.name)}</h3>
            </div>
            <span class="status-badge ${meta.cls}">
              <span class="status-dot"></span>
              <span>${meta.label}</span>
            </span>
          </div>
          <p class="lab-copy">${esc(img.description)}</p>
          <div class="tag-row">${tags.join('')}</div>
          <div class="card-actions">${actions.join('')}</div>
        </article>
      `;
    })
    .join('');
}

async function loadWslcOverview() {
  try {
    const overview = await fetchJson('/api/wslc/overview');
    renderWslcCards(overview);
  } catch (error) {
    els.wslcGrid.innerHTML = `<div class="empty">No se pudo cargar WSLC: ${esc(error.message)}</div>`;
  }
}

async function runWslcAction(id, action) {
  const verbo = { build: 'construyendo', run: 'ejecutando', stop: 'deteniendo', logs: 'logs' }[action] || action;
  els.logsTitle.textContent = `Contenedor ${id} (${action})`;
  els.logsOutput.textContent = `WSLC: ${verbo} "${id}"… (build/run pueden tardar)`;
  const payload = await fetchJson(`/api/wslc/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  els.logsOutput.textContent = payload.output || 'Acción completada sin salida adicional.';
  if (action !== 'logs') {
    await loadWslcOverview();
  }
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
  // Acciones de contenedores WSLC.
  const wslcTarget = event.target.closest('[data-wslc-action]');
  if (wslcTarget) {
    const id = wslcTarget.getAttribute('data-id');
    const action = wslcTarget.getAttribute('data-wslc-action');
    if (!id || !action) return;
    try {
      wslcTarget.disabled = true;
      await runWslcAction(id, action);
    } catch (error) {
      els.logsOutput.textContent = error.message;
    } finally {
      wslcTarget.disabled = false;
    }
    return;
  }

  // Acciones de servicios (labs).
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
    await Promise.all([loadOverview(), loadWslcOverview()]);
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
loadWslcOverview();
