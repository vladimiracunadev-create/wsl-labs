#!/usr/bin/env bash
# wsl-labs · Instalación y arranque de MySQL Server (idempotente)
# No está en el catálogo principal, pero se mantiene alineado con el resto.
set -euo pipefail

SERVICIO="mysql"
PUERTO=3306

# --- 1) Instalar mysql-server solo si no está (idempotente) -----------------
if command -v mysql >/dev/null 2>&1 && dpkg -s mysql-server >/dev/null 2>&1; then
  echo "[wsl-labs] MySQL ya instalado; se omite apt."
else
  echo "[wsl-labs] Instalando MySQL Server..."
  sudo apt-get update
  sudo apt-get install -y mysql-server
fi

# --- 2) Arrancar el servicio ------------------------------------------------
sudo service mysql start

# --- 3) Verificación real ---------------------------------------------------
if command -v mysqladmin >/dev/null 2>&1 && sudo mysqladmin ping >/dev/null 2>&1; then
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
elif ss -ltn 2>/dev/null | grep -q ":${PUERTO}"; then
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: MySQL no responde en :${PUERTO}" >&2
  exit 1
fi
