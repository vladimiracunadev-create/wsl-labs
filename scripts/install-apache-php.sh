#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Instalando Apache + PHP..."
sudo apt update
sudo apt install -y apache2 php libapache2-mod-php
sudo systemctl enable apache2 || true
sudo systemctl restart apache2

echo "[wsl-labs] Apache + PHP instalado."
