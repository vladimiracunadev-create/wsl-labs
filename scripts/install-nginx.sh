#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Instalando Nginx..."
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx || true
sudo systemctl restart nginx

echo "[wsl-labs] Nginx instalado. Prueba con: curl http://localhost"
