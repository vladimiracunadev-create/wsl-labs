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

# --- 2) Verificación --------------------------------------------------------
if command -v node >/dev/null 2>&1; then
  echo "[wsl-labs] node $(node -v) · npm $(npm -v 2>/dev/null || echo 'n/a')"
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO} (la API se arranca con el startCommand del catálogo)"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: 'node' no está disponible tras la instalación." >&2
  exit 1
fi
