#!/usr/bin/env bash
# wsl-labs · Instalación de Node.js dentro de WSL (idempotente)
# Sirve para correr la API de ejemplo (examples/node-api) en el puerto 8082.
# Fuente de verdad: labs.config.json (node = 8082).
set -euo pipefail

SERVICIO="node"
PUERTO=8082

# --- 1) Instalar Node.js solo si no está (idempotente) ----------------------
if command -v node >/dev/null 2>&1; then
  echo "[wsl-labs] Node.js ya instalado ($(node -v)); se omite instalación."
else
  echo "[wsl-labs] Instalando Node.js..."
  # Preferimos el repo NodeSource (versión LTS reciente). Si no hay red para
  # NodeSource, caemos al paquete de Ubuntu (nodejs + npm).
  if curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - ; then
    sudo apt-get install -y nodejs
  else
    echo "[wsl-labs] NodeSource no disponible; usando paquetes de Ubuntu."
    sudo apt-get update
    sudo apt-get install -y nodejs npm
  fi
fi

# --- 2) Servicio systemd ENABLED (sobrevive reinicios de la instancia WSL) ---
# Node se ejecuta como servicio systemd habilitado, igual que nginx/apache, para
# que sobreviva a los reinicios por inactividad de WSL2. La ruta del repo se
# calcula desde la ubicación de este script.
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$(command -v node || echo /usr/bin/node)"
UNIT=/etc/systemd/system/wsl-labs-node.service
echo "[wsl-labs] Instalando servicio systemd wsl-labs-node (WorkingDirectory=${REPO_ROOT}/examples/node-api)"
sudo tee "$UNIT" >/dev/null <<EOF
[Unit]
Description=wsl-labs node-api (:${PUERTO})
After=network.target

[Service]
Type=simple
WorkingDirectory=${REPO_ROOT}/examples/node-api
Environment=PORT=${PUERTO}
ExecStart=${NODE_BIN} server.js
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable wsl-labs-node >/dev/null 2>&1 || true

# --- 3) Verificación --------------------------------------------------------
if command -v node >/dev/null 2>&1; then
  echo "[wsl-labs] node $(node -v) · npm $(npm -v 2>/dev/null || echo 'n/a')"
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO} (servicio systemd wsl-labs-node habilitado)"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: 'node' no está disponible tras la instalación." >&2
  exit 1
fi
