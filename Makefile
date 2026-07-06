SHELL := /bin/bash

WSLC ?= /c/Program Files/WSL/wslc.exe

.PHONY: help serve test-dashboard doctor \
	up-nginx up-apache up-node up-python up-postgres up-mini \
	down-nginx down-apache down-node down-python down-postgres down-mini \
	status logs-nginx logs-apache logs-node logs-python logs-postgres \
	wslc-build wslc-up wslc-down wslc-ps

help:
	@echo "wsl-labs — targets disponibles:"
	@echo "  make serve             # Control Center Node.js + REST API en 9092"
	@echo "  make test-dashboard    # verifica catalogo + localhost"
	@echo "  make doctor            # diagnostico del host (WSL, distro, servicios)"
	@echo "  make up-nginx          # nginx en 8080     | make down-nginx"
	@echo "  make up-apache         # apache+php en 8081 | make down-apache"
	@echo "  make up-node           # node API en 8082  | make down-node"
	@echo "  make up-python         # flask en 8083     | make down-python"
	@echo "  make up-postgres       # postgresql en 5432| make down-postgres"
	@echo "  make up-mini           # mini-servidor 8090| make down-mini"
	@echo "  make status            # estado de servicios en WSL"
	@echo "  make logs-*            # ultimas lineas de log de un servicio"
	@echo "  -- Contenedores WSLC --"
	@echo "  make wslc-build        # construye las 3 imagenes (wslc build)"
	@echo "  make wslc-up           # ejecuta los 3 contenedores (8091-8093)"
	@echo "  make wslc-down         # detiene y elimina los contenedores"
	@echo "  make wslc-ps           # lista imagenes y contenedores wslc"

serve:
	@node dashboard-server/server.js

test-dashboard:
	@node dashboard-server/verify-localhost.js

doctor:
	@bash scripts/doctor.sh

# ── Contenedores WSLC (imagenes reales con wslc) ────────────────────────────
wslc-build:
	@"$(WSLC)" build -t wsl-labs/web-nginx:latest wslc/web-nginx
	@"$(WSLC)" build -t wsl-labs/node-api:latest wslc/node-api
	@"$(WSLC)" build -t wsl-labs/python-flask:latest wslc/python-flask

wslc-up:
	@"$(WSLC)" run -d --name wsl-labs-nginx -p 8091:80   wsl-labs/web-nginx:latest
	@"$(WSLC)" run -d --name wsl-labs-node  -p 8092:8082 wsl-labs/node-api:latest
	@"$(WSLC)" run -d --name wsl-labs-flask -p 8093:8083 wsl-labs/python-flask:latest

wslc-down:
	@-"$(WSLC)" stop wsl-labs-nginx wsl-labs-node wsl-labs-flask
	@-"$(WSLC)" rm   wsl-labs-nginx wsl-labs-node wsl-labs-flask

wslc-ps:
	@"$(WSLC)" images
	@"$(WSLC)" list

up-nginx:
	@sudo service nginx start
down-nginx:
	@sudo service nginx stop || true

up-apache:
	@sudo service apache2 start
down-apache:
	@sudo service apache2 stop || true

up-node:
	@cd examples/node-api && PORT=8082 nohup node server.js > /tmp/wsl-labs-node.log 2>&1 & echo "node en :8082"
down-node:
	@pkill -f 'node server.js' || true

up-python:
	@cd examples/python-flask && PORT=8083 nohup python3 app.py > /tmp/wsl-labs-flask.log 2>&1 & echo "flask en :8083"
down-python:
	@pkill -f 'app.py' || true

up-postgres:
	@sudo service postgresql start
down-postgres:
	@sudo service postgresql stop || true

up-mini: up-nginx up-postgres
down-mini: down-nginx down-postgres

status:
	@echo "== Servicios ==" && (service --status-all 2>/dev/null || true)

logs-nginx:
	@sudo tail -n 50 /var/log/nginx/access.log 2>/dev/null || true
logs-apache:
	@sudo tail -n 50 /var/log/apache2/access.log 2>/dev/null || true
logs-node:
	@tail -n 50 /tmp/wsl-labs-node.log 2>/dev/null || true
logs-python:
	@tail -n 50 /tmp/wsl-labs-flask.log 2>/dev/null || true
logs-postgres:
	@sudo tail -n 50 /var/log/postgresql/*.log 2>/dev/null || true
