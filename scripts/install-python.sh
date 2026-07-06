#!/usr/bin/env bash
# wsl-labs · Instalación de Python + Flask dentro de WSL (idempotente)
# Deja listo examples/python-flask/app.py para correr en el puerto 8083.
# Fuente de verdad: labs.config.json (flask = 8083).
set -euo pipefail

SERVICIO="flask"
PUERTO=8083

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FLASK_DIR="${REPO_ROOT}/examples/python-flask"
VENV_DIR="${FLASK_DIR}/.venv"

# --- 1) Instalar python3 + pip + venv solo si faltan (idempotente) ----------
PAQUETES=(python3 python3-pip python3-venv)
FALTAN=()
for pkg in "${PAQUETES[@]}"; do
  if ! dpkg -s "$pkg" >/dev/null 2>&1; then
    FALTAN+=("$pkg")
  fi
done
if [ "${#FALTAN[@]}" -eq 0 ]; then
  echo "[wsl-labs] python3/pip/venv ya instalados; se omite apt."
else
  echo "[wsl-labs] Instalando: ${FALTAN[*]}"
  sudo apt-get update
  sudo apt-get install -y "${FALTAN[@]}"
fi

# --- 2) Crear un venv en el repo e instalar Flask (idempotente) -------------
# Usamos un venv para no chocar con PEP 668 (entornos gestionados externamente).
if [ ! -d "$VENV_DIR" ]; then
  echo "[wsl-labs] Creando venv en ${VENV_DIR}"
  python3 -m venv "$VENV_DIR"
fi
# pip install es idempotente: si Flask ya está, no reinstala.
if [ -f "${FLASK_DIR}/requirements.txt" ]; then
  "${VENV_DIR}/bin/pip" install --upgrade pip >/dev/null
  "${VENV_DIR}/bin/pip" install -r "${FLASK_DIR}/requirements.txt"
else
  "${VENV_DIR}/bin/pip" install flask
fi

# --- 3) Verificación --------------------------------------------------------
if "${VENV_DIR}/bin/python" -c "import flask" 2>/dev/null; then
  echo "[wsl-labs] Flask disponible en el venv (${VENV_DIR})."
  echo "[wsl-labs] Para correr la app: ${VENV_DIR}/bin/python ${FLASK_DIR}/app.py (PORT=${PUERTO})"
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: no se pudo importar flask en el venv." >&2
  exit 1
fi
