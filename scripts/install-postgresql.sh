#!/usr/bin/env bash
set -euo pipefail

echo "[wsl-labs] Instalando PostgreSQL..."
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql || true
sudo systemctl restart postgresql

echo "[wsl-labs] PostgreSQL instalado."
echo "Puedes entrar con: sudo -u postgres psql"
