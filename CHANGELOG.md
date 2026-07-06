# 📓 Changelog

Todos los cambios relevantes del repositorio se registran aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y
el proyecto adopta [versionado semántico](https://semver.org/lang/es/).

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
