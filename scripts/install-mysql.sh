#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Instalando MySQL Server..."
sudo apt update
sudo apt install -y mysql-server
sudo systemctl enable mysql || true
sudo systemctl restart mysql

echo "[wsl-labs] MySQL instalado."
echo "Puedes revisar estado con: sudo systemctl status mysql"
