# 📊 Project Status

> **Versión**: v0.3.0
> **Estado general**: 🟢 Operativo — panel + motor WSLC + launcher + 12 casos de contenedores
> **Alcance actual**: 🐳 12 casos portados de docker-labs, levantados con `wslc`, verificados corriendo
> **Última actualización**: 2026-07-06

---

## 🧭 Resumen ejecutivo

**WSL Container Center** levanta y controla **contenedores reales** con `wslc`, el
motor de contenedores nativo de WSL 2.9+ (preview). El **panel** (Node.js, `:9092`)
construye imágenes, levanta contenedores y monitorea su estado; un **launcher Go**
abre todo con un doble clic; y [`containers/containers.config.json`](containers/containers.config.json)
es la fuente única de verdad del catálogo de **12 casos** portados de `docker-labs`,
**todos verificados corriendo**.

> [!NOTE]
> `wslc` se obtiene con `wsl --update --pre-release` y vive en
> `C:\Program Files\WSL\wslc.exe`. El modelo es tipo Docker: imágenes OCI,
> contenedores, redes y puertos — sin necesidad de Docker Desktop.

---

## 🚀 Matriz de componentes

| Componente | Estado | Detalle |
| --- | :---: | --- |
| 🧭 Panel WSL Container Center (Node.js `:9092`) | ✅ | `GET /api/wslc/overview`, `POST /api/wslc/{build,up,down,logs}` |
| 🖥️ UI web (`index.html` + css + js) | ✅ | Botones Construir / Levantar / Bajar / Logs por caso |
| 🐳 Motor WSLC | ✅ | `C:\Program Files\WSL\wslc.exe` (WSL 2.9+ preview) |
| 🚀 Launcher Windows (Go) | ✅ | Verifica WSL, arranca el panel, abre el browser |
| 📇 Catálogo `containers.config.json` | ✅ | Fuente única de verdad — 12 casos |
| 🐳 12 casos de contenedores | ✅ | 4 starter + 4 platform + 4 infra, todos corriendo |
| 🔨 Imágenes custom (`wslc build`) | ✅ | Desde Dockerfiles; `10-go-api` multi-stage |
| 🌐 Multi-contenedor por red `wslc` | ✅ | Casos platform + observabilidad |
| ⚙️ CI/CD (GitHub Actions) | ✅ | docs · dashboard · build-windows |
| ⚖️ Licencia Apache-2.0 | ✅ | Alineada con la línea de repos |

---

## 📡 Estado de los 12 casos

> Los 12 casos se **construyen/levantan con `wslc`** y responden desde el `localhost`
> de Windows. El criterio de "sano" depende del servicio (no todo es HTTP 200): los
> stacks con base de datos verifican además que el backend sea **reachable**.

| Caso | Categoría | Puerto | Imagen(es) | Verificación | Estado |
| --- | --- | :---: | --- | --- | :---: |
| `01-node-api` | 🟢 starter | 8101 | `node:20-alpine` (custom) | HTTP 200 | ✔ |
| `03-python-api` | 🟢 starter | 8102 | `python:3.12-alpine` (custom) | HTTP 200 | ✔ |
| `10-go-api` | 🟢 starter | 8103 | Go multi-stage (custom) | HTTP 200 | ✔ |
| `06-nginx-web` | 🟢 starter | 8104 | `nginx:alpine` (custom) | HTTP 200 | ✔ |
| `04-redis-cache` | 🧩 platform | 8105 | `redis:7-alpine` + app | HTTP 200 + Redis reachable | ✔ |
| `05-postgres-api` | 🧩 platform | 8106 | `postgres:15` + app | HTTP 200 + PostgreSQL reachable | ✔ |
| `02-php-lamp` | 🧩 platform | 8107 | `mariadb:10.6` + PHP/Apache | HTTP 200 + MariaDB reachable | ✔ |
| `09-multi-service` | 🧩 platform | 8112 | `mongo:7` + backend | HTTP 200 + MongoDB reachable | ✔ |
| `07-rabbitmq` | 🏗️ infra | 8109 | `rabbitmq:3-management` | HTTP 200/302 | ✔ |
| `08-prometheus-grafana` | 🏗️ infra | 8110/8111 | `prom/prometheus` + `grafana/grafana` | Grafana 302 / Prometheus 200 | ✔ |
| `11-elasticsearch` | 🏗️ infra | 8113 | `elasticsearch:8.11.0` | HTTP 200 (JSON) | ✔ |
| `12-jenkins` | 🏗️ infra | 8114 | `jenkins/jenkins:lts` | HTTP 403 (setup → vivo) | ✔ |

**Resultado verificado (v0.3.0)**: **12/12 casos corriendo** con `wslc`.

---

## ✅ Lo consolidado

- Panel Node.js operativo en `localhost:9092`, sin dependencias npm (`http` nativo)
- Motor **WSLC** integrado con el panel vía `GET /api/wslc/overview` y
  `POST /api/wslc/{build,up,down,logs}`
- **12 casos** portados de `docker-labs` y verificados corriendo con `wslc`
- Imágenes custom construidas con `wslc build` desde Dockerfiles (incluye multi-stage)
- Multi-contenedor por **red `wslc`** (app + base de datos por nombre de contenedor)
- Launcher Go que levanta la plataforma en un doble clic
- Catálogo `containers/containers.config.json` como única fuente de verdad
- CI/CD en GitHub Actions
- Licencia Apache-2.0

---

## 🚧 Lo que sigue en evolución

- 🧪 Más casos de contenedores (colas, otras bases, gateways) — ver [ROADMAP.md](ROADMAP.md)
- 🧩 `wslc-compose` si Microsoft lo publica (hoy el multi-contenedor es manual)
- 💾 Volúmenes persistentes por caso
- 🩺 Healthchecks avanzados (readiness, reintentos)
- 🎥 Demo grabada del flujo completo para portafolio

---

## ⚠️ Riesgos o límites actuales

| Riesgo | Impacto |
| --- | --- |
| `wslc` está en **preview** (WSL 2.9+) | API y comportamiento pueden cambiar entre builds de WSL |
| Sin `wslc compose` | El multi-contenedor se arma a mano con red `wslc` + varios `wslc run` |
| `11-elasticsearch` y `12-jenkins` pesan (JVM) | Requieren RAM extra; no levantarlos junto a varios casos platform |
| Instalador sin firma digital (v0.x) | Windows SmartScreen puede advertir |
| `wslc` no detectado en otra ruta | El panel lo busca en `C:\Program Files\WSL\wslc.exe` |

---

## 📚 Recomendación de lectura

| Si quieres… | Abre |
| --- | --- |
| Entender la historia principal | [README.md](README.md) |
| Evaluar el repo rápido | [RECRUITER.md](RECRUITER.md) |
| Entender el enfoque de contenedores | [docs/wslc-contenedores.md](docs/wslc-contenedores.md) |
| Ver el catálogo de casos | [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md) |
| Ver el detalle operativo por caso | [docs/LABS_RUNTIME_REFERENCE.md](docs/LABS_RUNTIME_REFERENCE.md) |
| Ver el historial de cambios | [CHANGELOG.md](CHANGELOG.md) |
| Ver la dirección futura | [ROADMAP.md](ROADMAP.md) |

---

📖 Ver también: [README.md](README.md) · [ROADMAP.md](ROADMAP.md) · [docs/technical-audit.md](docs/technical-audit.md)
