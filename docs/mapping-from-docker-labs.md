# 🔀 Mapeo desde docker-labs

> Cómo se traduce cada concepto de `docker-labs` a su equivalente en `wsl-labs`.
> El **motor cambia** (Docker/Compose → **WSLC**, el motor de contenedores nativo de
> WSL), pero el modelo es el mismo: imágenes OCI, contenedores, redes y puertos.
> Para el contexto completo, consulta el [README.md](../README.md).

---

## 🤝 Qué se conserva

| Aspecto | Descripción |
| --- | --- |
| 📁 Estructura por casos | Directorio numerado `NN-nombre-kebab` por caso |
| 🐳 Contenedores reales | Imágenes OCI por capas desde `Dockerfile`, no emulación |
| 🏠 Operación local | Sin dependencias de cloud para el flujo principal |
| 🌐 Foco en `localhost` | Los contenedores publican puertos con `-p host:container` |
| 🧭 Panel web | Panel Node.js que gobierna todo desde `:9092` |
| 🚀 Launcher Windows (Go) | Un `.exe` que levanta la plataforma y abre el browser |
| 📇 Catálogo fuente de verdad | Un solo archivo define imágenes, puertos, redes y health |

---

## 🔄 Tabla de equivalencias conceptuales

| Concepto en docker-labs | 🐳 Equivalente en wsl-labs | Nota |
| --- | --- | --- |
| `docker build` | `wslc build` | Misma construcción por capas desde `Dockerfile` |
| `docker run -d -p …` | `wslc run -d -p …` | Levanta un contenedor en segundo plano |
| `docker rm -f` | `wslc stop` | Detiene y elimina el contenedor |
| `docker compose up` | red `wslc` + varios `wslc run` conectados | Multi-contenedor sin `compose` |
| `docker-compose.yml` | Entrada en `containers.config.json` | La fuente única de verdad del caso |
| **Servicio de compose** | **Contenedor del caso** | `name`, `image`, `ports`, `env` |
| **Imagen** | **Imagen** (`wslc build` o `wslc pull`) | Idéntico — OCI por capas |
| **Red de compose** | **Red `wslc`** (`wslc network create`) | La app apunta al backend por nombre |
| **Puerto publicado** (`-p 8080:80`) | **`-p host:container`** en `wslc run` | Mismo mapeo de puertos |
| **Volumen** | **Volumen `wslc`** / filesystem | Modelo de contenedores estándar |
| **Healthcheck de compose** | `healthProtocol: http` | El panel hace el check (HTTP GET) |
| `docker compose logs` | `wslc logs` | `POST /api/wslc/logs { id }` |
| `docker compose down` | `wslc stop` (por caso) | `POST /api/wslc/down { id }` |
| **Docker daemon** | **Motor WSLC nativo** | `C:\Program Files\WSL\wslc.exe` |
| **Docker Desktop** | **WSL 2.9+ + WSL Container Center** | El motor viene con WSL preview |
| `dashboard-control` (9090) | **WSL Container Center** (`:9092`) | Mismo rol, motor WSLC |

---

## 🔁 Qué cambia en el motor

| Aspecto | `docker-labs` | `wsl-labs` |
| --- | --- | --- |
| Motor | Docker Engine / Docker Desktop | **WSLC** nativo de WSL 2.9+ (preview) |
| Comando build | `docker build` | `wslc build` |
| Comando run | `docker run` | `wslc run` |
| Multi-contenedor | `docker compose` | red `wslc` + varios `wslc run` |
| Empaquetado | Imágenes OCI | Imágenes OCI (idéntico) |
| Instalación | Docker Desktop aparte | Incluido en `wsl --update --pre-release` |
| Catálogo | `docker-compose.yml` por lab | `containers.config.json` central |

---

## 🎯 Traducción caso a caso (docker-labs → wsl-labs)

Cada caso de `docker-labs` tiene su equivalente portado y verificado en `wsl-labs`:

| Caso docker-labs | Caso wsl-labs | Imagen(es) | Puerto |
| --- | --- | --- | :---: |
| API Node | `01-node-api` | `node:20-alpine` (custom) | `8101` |
| API Python | `03-python-api` | `python:3.12-alpine` (custom) | `8102` |
| API Go | `10-go-api` | Go multi-stage (custom) | `8103` |
| Web Nginx | `06-nginx-web` | `nginx:alpine` (custom) | `8104` |
| Cache Redis | `04-redis-cache` | `redis:7-alpine` + app | `8105` |
| API + PostgreSQL | `05-postgres-api` | `postgres:15` + app | `8106` |
| LAMP | `02-php-lamp` | `mariadb:10.6` + PHP/Apache | `8107` |
| RabbitMQ | `07-rabbitmq` | `rabbitmq:3-management` | `8109` |
| Prometheus + Grafana | `08-prometheus-grafana` | `prom/prometheus` + `grafana/grafana` | `8110`/`8111` |
| Multi-servicio (Mongo) | `09-multi-service` | `mongo:7` + backend | `8112` |
| Elasticsearch | `11-elasticsearch` | `elasticsearch:8.11.0` | `8113` |
| Jenkins | `12-jenkins` | `jenkins/jenkins:lts` | `8114` |

---

## ✅ Resultado esperado

La experiencia final **sí** es "contenedores reales", pero con el motor **nativo de
WSL** en lugar de Docker:

- 🐳 **Contenedores OCI reales** construidos y ejecutados con `wslc`
- 🧩 **Multi-contenedor por red `wslc`** en lugar de `docker compose`
- 🧭 **WSL Container Center** como panel de control (`:9092`)
- 🚀 **Launcher Windows** como superficie desktop
- 🌐 **Puertos publicados** con `-p host:container`, igual que Docker

> [!NOTE]
> A diferencia de Docker, **no necesitas instalar Docker Desktop**: `wslc` viene
> integrado en WSL 2.9+ (preview). El modelo de contenedores es el mismo; cambia el
> binario y que el motor ya está en WSL.

---

📖 Ver también: [README.md](../README.md) · [wslc-contenedores.md](wslc-contenedores.md) · [LABS_CATALOG.md](LABS_CATALOG.md)
