#!/usr/bin/env bash
# wsl-labs · Instalación de herramientas base (idempotente)
# Instala curl, git y utilidades de red/compilación usadas por el resto de scripts.
set -euo pipefail

SERVICIO="base"

# --- Detectar qué falta antes de tocar apt (idempotencia) -------------------
PAQUETES=(git curl wget unzip build-essential ca-certificates nano htop net-tools iproute2)
FALTAN=()
for pkg in "${PAQUETES[@]}"; do
  # dpkg -s devuelve 0 si el paquete ya está instalado
  if ! dpkg -s "$pkg" >/dev/null 2>&1; then
    FALTAN+=("$pkg")
  fi
done

if [ "${#FALTAN[@]}" -eq 0 ]; then
  echo "[wsl-labs] Todas las herramientas base ya están instaladas; no se toca apt."
else
  echo "[wsl-labs] Instalando herramientas base faltantes: ${FALTAN[*]}"
  sudo apt-get update
  sudo apt-get install -y "${FALTAN[@]}"
fi

# --- Verificación final -----------------------------------------------------
if command -v curl >/dev/null 2>&1 && command -v git >/dev/null 2>&1; then
  echo "[wsl-labs] ${SERVICIO} OK (curl $(curl --version | head -n1 | awk '{print $2}'), git $(git --version | awk '{print $3}'))"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: curl o git no están disponibles tras la instalación." >&2
  exit 1
fi
