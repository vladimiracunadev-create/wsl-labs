#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Actualizando sistema e instalando herramientas base..."
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl wget unzip build-essential ca-certificates nano htop net-tools iproute2

echo "[wsl-labs] Base instalada correctamente."
