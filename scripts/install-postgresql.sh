#!/usr/bin/env bash
# wsl-labs · Instalación y arranque de PostgreSQL en localhost:5432 (idempotente)
# Fuente de verdad: labs.config.json (postgres = 5432).
set -euo pipefail

SERVICIO="postgresql"
PUERTO=5432

# --- 1) Instalar postgresql solo si no está (idempotente) -------------------
if command -v psql >/dev/null 2>&1 && dpkg -s postgresql >/dev/null 2>&1; then
  echo "[wsl-labs] PostgreSQL ya instalado; se omite apt."
else
  echo "[wsl-labs] Instalando PostgreSQL..."
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
fi

# --- 2) Asegurar que escucha en localhost:5432 (idempotente) ----------------
# Ubuntu ya usa 5432 por defecto y escucha en localhost, pero lo forzamos por
# si algún postgresql.conf lo cambió. Buscamos el/los archivo(s) de config.
while IFS= read -r CONF; do
  [ -n "$CONF" ] || continue
  # port = 5432 (descomentado)
  if ! grep -qE "^\s*port\s*=\s*5432" "$CONF"; then
    echo "[wsl-labs] Fijando 'port = 5432' en $CONF"
    sudo sed -i -E "s/^\s*#?\s*port\s*=.*/port = 5432/" "$CONF"
  fi
  # listen_addresses incluye localhost
  if ! grep -qE "^\s*listen_addresses\s*=\s*'.*localhost.*'" "$CONF" \
     && ! grep -qE "^\s*listen_addresses\s*=\s*'.*127\.0\.0\.1.*'" "$CONF"; then
    echo "[wsl-labs] Fijando \"listen_addresses = 'localhost'\" en $CONF"
    sudo sed -i -E "s/^\s*#?\s*listen_addresses\s*=.*/listen_addresses = 'localhost'/" "$CONF"
  fi
done < <(sudo find /etc/postgresql -name postgresql.conf 2>/dev/null)

# --- 3) Arrancar el servicio ------------------------------------------------
sudo service postgresql start

# --- 4) Verificación real ---------------------------------------------------
if command -v pg_isready >/dev/null 2>&1; then
  if pg_isready -h localhost -p "${PUERTO}" >/dev/null 2>&1; then
    echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
  else
    echo "[wsl-labs] ${SERVICIO} FALLO: pg_isready no responde en localhost:${PUERTO}" >&2
    exit 1
  fi
else
  # Fallback si pg_isready no está en el PATH: comprobar el socket con ss
  if ss -ltn 2>/dev/null | grep -q ":${PUERTO}"; then
    echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
  else
    echo "[wsl-labs] ${SERVICIO} FALLO: nada escuchando en :${PUERTO}" >&2
    exit 1
  fi
fi
