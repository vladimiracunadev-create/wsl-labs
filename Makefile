SHELL := /bin/bash
WSLC ?= /c/Program Files/WSL/wslc.exe

.PHONY: help serve test-dashboard images ps prune \
	build-node build-python build-go build-nginx build-redis build-postgres build-php build-multi

help:
	@echo "wsl-labs — WSL Container Center (motor: wslc)"
	@echo "  make serve            # panel Node.js + REST API en 9092"
	@echo "  make test-dashboard   # verifica catalogo + endpoint /api/wslc/overview"
	@echo "  make images           # lista imagenes wslc"
	@echo "  make ps               # lista contenedores wslc"
	@echo "  make prune            # elimina contenedores parados + imagenes colgadas"
	@echo "  make build-<caso>     # construye la imagen de un caso (node/python/go/nginx/redis/postgres/php/multi)"
	@echo ""
	@echo "  Levanta y controla los contenedores desde el panel (http://localhost:9092):"
	@echo "  cada caso tiene botones Construir / Levantar / Bajar / Logs."

serve:
	@node dashboard-server/server.js

test-dashboard:
	@node dashboard-server/verify-localhost.js

images:
	@"$(WSLC)" images

ps:
	@"$(WSLC)" list

prune:
	@-"$(WSLC)" container prune
	@-"$(WSLC)" image prune

build-node:
	@"$(WSLC)" build -t wsl-labs/node-api:latest containers/01-node-api
build-python:
	@"$(WSLC)" build -t wsl-labs/python-api:latest containers/03-python-api
build-go:
	@"$(WSLC)" build -t wsl-labs/go-api:latest containers/10-go-api
build-nginx:
	@"$(WSLC)" build -t wsl-labs/nginx-web:latest containers/06-nginx-web
build-redis:
	@"$(WSLC)" build -t wsl-labs/redis-app:latest containers/04-redis-cache
build-postgres:
	@"$(WSLC)" build -t wsl-labs/pg-app:latest containers/05-postgres-api
build-php:
	@"$(WSLC)" build -t wsl-labs/php-lamp:latest containers/02-php-lamp
build-multi:
	@"$(WSLC)" build -t wsl-labs/multi-backend:latest containers/09-multi-service
