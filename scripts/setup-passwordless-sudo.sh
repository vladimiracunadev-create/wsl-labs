#!/usr/bin/env bash
# setup-passwordless-sudo.sh
# -------------------------------------------------------------------------
# El WSL Control Center arranca servicios con `sudo service <x> start` de forma
# NO interactiva (a través de wsl.exe). Si `sudo` pide contraseña, esos botones
# se cuelgan. Este script instala una regla acotada en /etc/sudoers.d que permite
# SOLO los comandos de servicio de wsl-labs sin contraseña, para el usuario actual.
#
# Ejecútalo UNA vez, con tu contraseña:
#     wsl bash scripts/setup-passwordless-sudo.sh
#
# Alcance mínimo: solo `service` y `systemctl` sobre nginx / apache2 / postgresql.
# No concede sudo total. Para revertir: sudo rm /etc/sudoers.d/wsl-labs
set -euo pipefail

USER_NAME="$(id -un)"
SUDOERS_FILE="/etc/sudoers.d/wsl-labs"

echo "[wsl-labs] Configurando passwordless sudo acotado para: $USER_NAME"

# Rutas reales de los binarios (sudoers exige rutas absolutas).
SERVICE_BIN="$(command -v service || echo /usr/sbin/service)"
SYSTEMCTL_BIN="$(command -v systemctl || echo /usr/bin/systemctl)"

TMP="$(mktemp)"
cat > "$TMP" <<EOF
# Generado por wsl-labs/scripts/setup-passwordless-sudo.sh
# Permite al Control Center gestionar SOLO estos servicios sin contraseña.
$USER_NAME ALL=(root) NOPASSWD: $SERVICE_BIN nginx *, $SERVICE_BIN apache2 *, $SERVICE_BIN postgresql *
$USER_NAME ALL=(root) NOPASSWD: $SYSTEMCTL_BIN * nginx, $SYSTEMCTL_BIN * apache2, $SYSTEMCTL_BIN * postgresql
EOF

# Validar la sintaxis ANTES de instalar (visudo -c evita romper sudo).
if ! sudo visudo -c -f "$TMP" >/dev/null; then
  echo "[wsl-labs] ERROR: el archivo sudoers generado no es válido. Abortado." >&2
  rm -f "$TMP"
  exit 1
fi

sudo install -m 0440 -o root -g root "$TMP" "$SUDOERS_FILE"
rm -f "$TMP"

echo "[wsl-labs] Regla instalada en $SUDOERS_FILE"
echo "[wsl-labs] Prueba: sudo -n service nginx status  (no debería pedir contraseña)"
echo "[wsl-labs] Revertir: sudo rm $SUDOERS_FILE"
