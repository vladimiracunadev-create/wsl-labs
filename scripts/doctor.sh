#!/usr/bin/env bash
# doctor.sh — diagnóstico rápido del entorno wsl-labs (ejecutar DENTRO de WSL).
# Verifica distro, herramientas y servicios usados por el Control Center.
set -uo pipefail

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; }

echo "== wsl-labs · doctor =="
echo ""

echo "Sistema:"
if grep -qi microsoft /proc/version 2>/dev/null; then ok "corriendo dentro de WSL"; else warn "no parece WSL (¿ejecutas en Linux nativo?)"; fi
if [ -f /etc/os-release ]; then . /etc/os-release; ok "distro: ${PRETTY_NAME:-desconocida}"; else warn "no se pudo leer /etc/os-release"; fi
echo ""

echo "Herramientas:"
for bin in node npm python3 psql nginx apache2 curl ss; do
  if command -v "$bin" >/dev/null 2>&1; then ok "$bin: $(command -v "$bin")"; else warn "$bin no instalado (algunos labs lo requieren)"; fi
done
echo ""

echo "Puertos del catálogo (localhost):"
for p in 9092 8080 8081 8082 8083 5432 8090; do
  if command -v ss >/dev/null 2>&1 && ss -ltn 2>/dev/null | grep -q ":$p "; then
    ok "puerto $p en escucha"
  else
    warn "puerto $p libre (servicio detenido)"
  fi
done
echo ""

echo "Sugerencia: 'make serve' levanta el Control Center en http://localhost:9092"
