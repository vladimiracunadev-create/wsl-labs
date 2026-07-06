#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Instalando Python..."
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
python3 --version
pip3 --version || true

echo "[wsl-labs] Python instalado."
