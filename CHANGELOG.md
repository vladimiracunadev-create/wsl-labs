# 📓 Changelog

Todos los cambios relevantes del repositorio se registran aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y
el proyecto adopta [versionado semántico](https://semver.org/lang/es/).

---

## [0.2.0] - 2026-07-06

**Track de contenedores WSLC — imágenes reales, no solo servicios.**

Tras la llegada de **WSL Containers (WSLC)** —el motor de contenedores nativo de
WSL— el repo deja de cubrir solo *servicios en la distro* y añade **imágenes y
contenedores reales** (tipo Docker), conservando el track de servicios existente.

### Added

- 🐳 **Track WSLC** en `wslc/` con **3 imágenes reales** construidas desde
  Dockerfiles y verificadas (HTTP 200 desde Windows): `wsl-labs/web-nginx` (:8091),
  `wsl-labs/node-api` (:8092), `wsl-labs/python-flask` (:8093). Catálogo en
  `wslc/wslc.config.json`.
- 🧭 **Sección "Contenedores (WSLC)" en el Control Center** con botones
  **📦 Construir / ▶ Ejecutar / ⏹ Detener / 📄 Logs**. Nuevos endpoints:
  `GET /api/wslc/overview`, `POST /api/wslc/{build,run,stop,logs}`. El panel
  localiza `wslc.exe` (`C:\Program Files\WSL\wslc.exe`) y detecta si no está.
- 🧪 **Lab 13 · Contenedores WSLC** y guía [docs/wslc-contenedores.md](docs/wslc-contenedores.md).
- 📜 Historia de WSL ampliada con **WSL open source (Build 2025)** y **WSLC**.

### Verified

- ✅ `wslc build` (imagen real desde Dockerfile) → `wslc run` → contenedor →
  `curl localhost:8091/8092/8093` = **HTTP 200**. Ciclo Construir/Ejecutar/Detener
  operado desde el panel.

> [!NOTE]
> WSLC requiere **WSL 2.9+** (preview): `wsl --update --pre-release`. El track de
> servicios (nginx/apache/postgres como demonios) sigue disponible sin cambios.

---

## [0.1.2] - 2026-07-06

**Los 6 servicios quedan operativos de verdad**, verificados end-to-end.

### Fixed

- 🧩 **node** y **flask** no persistían: eran procesos en background que morían
  al reiniciarse la instancia WSL. Ahora son **servicios systemd habilitados**
  (`wsl-labs-node`, `wsl-labs-flask`), creados por sus `install-*.sh`, que
  arrancan solos en cada boot igual que nginx/apache/postgres.
- 🌐 El ejemplo `node-api` usaba **express** (sin `node_modules`) → reescrito con
  el módulo `http` nativo: arranca sin `npm install`.
- 🩺 Los health-checks del panel probaban solo IPv4; ahora prueban **IPv4 e IPv6**
  (como `curl localhost`), evitando falsos "detenido" en apache/node.
- 🔁 La detección de "instalado" parpadeaba a "No instalado" en sondas lentas;
  ahora **cachea y acumula positivos** (un servicio instalado no vuelve a
  aparecer como no instalado).
- 🐛 Los `startCommand` con `$WSL_LABS_ROOT` fallaban (las variables no se
  expanden vía `wsl.exe -- bash -lc`): el servidor **sustituye la ruta literal**.

### Added

- 🧱 **Lab 11 (mini-servidor)**: vhost nginx propio en `:8090`
  (`labs/11-mini-servidor-completo/nginx-mini.conf`) — antes nada escuchaba ahí.
- 💓 **Keepalive**: mientras el Control Center corre, mantiene viva la instancia
  WSL (como Docker Desktop con su VM) para que los servicios sigan accesibles.

### Verified

- ✅ **Los 6 servicios** instalados y operados desde el panel (root, sin
  contraseña) y respondiendo desde Windows: nginx `:8080`, apache `:8081`,
  node `:8082`, flask `:8083`, mini `:8090` → **HTTP 200**; postgres `:5432`
  aceptando conexiones. Dashboard: **6/6 saludables**.

---

## [0.1.1] - 2026-07-06

Operatividad real estilo **Docker**: el panel deja de pedir contraseña.

### Changed

- 🔑 El Control Center ejecuta los comandos en WSL como **root**
  (`wsl.exe -u root`), igual que Docker corre privilegiado. **Ya no se pide
  contraseña** para arrancar/detener servicios ni para instalarlos. El paso de
  *passwordless sudo* deja de ser necesario para el panel (queda opcional para
  uso por terminal con `make up-*`).

### Added

- 📦 **Botón "Instalar"** en cada servicio no instalado — endpoint
  `POST /api/wsl/install` que corre el `install-*.sh` del lab como root desde el
  propio panel. Flujo 1-click: **Instalar → Levantar**, sin terminal ni contraseña.
- 🔎 Detección de "**No instalado**" en el dashboard (sonda de binarios en WSL) y
  pista de instalación por servicio.

### Fixed

- 🐛 La detección de servicios devolvía vacío por un exit-code y por una
  peculiaridad de `wsl.exe` (las variables asignadas dentro de `bash -lc` no se
  expanden); ahora usa comandos literales sin variables de shell.

### Verified

- ✅ nginx instalado y operado desde el panel (root, sin contraseña); `curl`
  desde Windows a `http://localhost:8080` → **HTTP 200**; ciclo
  Levantar/Detener/Levantar controlando el servicio real.

---

## [0.1.0] - 2026-07-06

Primera versión del **WSL Control Center** — se alcanza paridad estructural con
los repos hermanos [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs)
y [`unikernel-labs`](https://github.com/vladimiracunadev-create/unikernel-labs).

### Added

- 🧭 **Control Center** (Node.js) en `localhost:9092` — servidor HTTP con el
  módulo `http` nativo (sin dependencias npm). Escucha solo en `127.0.0.1`,
  con rate-limit nativo y token opcional `WSL_LABS_TOKEN`. Actúa de puente
  Windows ↔ WSL2 vía `wsl.exe -d <distro> -- bash -lc "<comando>"`. Endpoints:
  `GET /api/overview`, `GET /api/health/:id`, `POST /api/wsl/{start|stop|logs}`.
- 🚀 **Launcher Windows (Go)** — `launcher/windows/main.go`, compilable a un
  `.exe` sin dependencias externas: verifica WSL2, detecta la distro, arranca el
  Control Center en segundo plano, hace polling a `/api/overview` y abre el
  navegador en `:9092`.
- 📇 **Catálogo `labs.config.json`** — fuente única de verdad del proyecto:
  puertos, comandos `start/stop/logs`, protocolo de health y estado por lab.
- 🐧 **12 labs normalizados** (`labs/01`–`labs/12`): instalación de Ubuntu,
  comandos base WSL, sistema de archivos, systemd, nginx (`:8080`),
  apache+php (`:8081`), node (`:8082`), flask (`:8083`), postgresql (`:5432`),
  backup export/import, mini-servidor completo (`:8090`) y troubleshooting.
- ⚙️ **CI/CD** en GitHub Actions — workflows de docs (markdownlint), dashboard
  (tests Node del Control Center) y build del launcher/instalador Windows.
- ⚖️ **Licencia Apache-2.0** — alineada con los repos hermanos de la línea.

---

📖 Ver también: [ROADMAP.md](ROADMAP.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md)
