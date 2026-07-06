# 🎯 RECRUITER — Para hiring managers y recruiters

> Qué demuestra este repo y qué dice sobre las capacidades de su autor.
> Recorrido pensado para **5 minutos**.

---

## ⚡ Qué mirar en 5 minutos

| # | Paso | Qué verás |
| --- | --- | --- |
| 1 | [README.md](README.md) | Historia principal, badges, diagrama de arquitectura |
| 2 | [PROJECT_STATUS.md](PROJECT_STATUS.md) | Estado v0.3.0: matriz de los 12 casos, todos corriendo |
| 3 | <http://localhost:9092> | El panel WSL Container Center en vivo (si lo levantaste) |
| 4 | [containers/containers.config.json](containers/containers.config.json) | La fuente única de verdad del catálogo |
| 5 | [dashboard-server/server.js](dashboard-server/server.js) | El puente Windows ↔ `wslc` en Node.js |
| 6 | [launcher/windows/main.go](launcher/windows/main.go) | El launcher Go de un solo `.exe` |

Con ese recorrido se entiende la plataforma de **contenedores nativa de WSL**, los 12
casos reales y la capa de producto (panel + launcher), sin revisar los 12 casos uno a uno.

---

## 🧠 Qué demuestra este repo

| Skill demostrada | Evidencia concreta |
| --- | --- |
| 🐳 Contenedores nativos de WSL | Uso de `wslc` (motor OCI de WSL 2.9+): `build`, `up`, `down`, `logs`, redes |
| 🏗️ Diseño de sistema | Arquitectura de 3 capas: UX Windows · panel Node.js · motor de contenedores |
| 🔨 Empaquetado por capas | Imágenes custom desde Dockerfiles; `10-go-api` con build multi-stage |
| 🧩 Multi-contenedor | App + base de datos por **red `wslc`** (Redis, PostgreSQL, MariaDB, Mongo) |
| 🌐 API REST local | `GET /api/wslc/overview`, `POST /api/wslc/{build,up,down,logs}` con `http` nativo |
| 🚀 Go | Launcher compilado a `.exe`, stdlib pura, sin dependencias, autodetección de distro |
| 📦 DevOps / CI-CD | GitHub Actions: docs, tests del panel, build del launcher/instalador |
| 📖 Documentación honesta | Se narra que `wslc` está en preview y qué se verificó de verdad (12/12) |

---

## 🔀 Narrativa de portafolio

Este repo es parte de una **línea de tres laboratorios** sobre tecnologías para
montar sistemas, que comparten arquitectura (panel web + launcher Windows +
servicios en localhost):

| Repo | Motor | Qué muestra |
| --- | --- | --- |
| [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs) | Docker / Compose | Reproducibilidad y operación de stacks |
| [`unikernel-labs`](https://github.com/vladimiracunadev-create/unikernel-labs) | Unikraft sobre WSL2 | Especialización y benchmarking de una suite local |
| **`wsl-labs`** | **WSLC (contenedores nativos de WSL)** | **Contenedores reales con el motor propio de WSL, sin Docker Desktop** |

Donde `docker-labs` demuestra orquestación con Docker y `unikernel-labs`
especialización, `wsl-labs` demuestra el **motor de contenedores nativo de WSL**:
los mismos 12 casos, construidos y ejecutados con `wslc` en lugar de Docker, con la
misma identidad visual y de producto que sus hermanos.

---

## ⚙️ Stack técnico demostrado

```text
🪟 Windows   →  Node.js (panel) · Go (launcher) · PowerShell
🐳 WSLC      →  wslc build / up / down / logs · imágenes OCI · redes wslc
🐧 Casos     →  Node · Python · Go · Nginx · Redis · PostgreSQL · MariaDB · Mongo · RabbitMQ · Prometheus/Grafana · Elasticsearch · Jenkins
☁️ CI/CD     →  GitHub Actions · markdownlint · tests Node · build del .exe
```

---

## ✅ Lo que esta v0.3.0 sí promete

- Control local de **contenedores reales desde Windows** con un panel web
- Motor **nativo de WSL** (`wslc`), sin necesidad de Docker Desktop
- **12 casos** portados de `docker-labs` y **verificados corriendo**
- Multi-contenedor por red `wslc` (app + base de datos)
- Un launcher `.exe` que levanta todo con un doble clic

> [!NOTE]
> La documentación es honesta: `wslc` está en **preview** (WSL 2.9+) y la
> verificación 12/12 es manual, no en CI. Esa claridad técnica es parte de lo que el
> repo demuestra.

---

📖 Ver también: [README.md](README.md) · [ROADMAP.md](ROADMAP.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md)
