#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Instalando Node.js y npm desde repositorios de Ubuntu..."
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v

echo "[wsl-labs] Node.js instalado."
