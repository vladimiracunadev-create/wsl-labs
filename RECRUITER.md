# 🎯 RECRUITER — Para hiring managers y recruiters

> Qué demuestra este repo y qué dice sobre las capacidades de su autor.
> Recorrido pensado para **5 minutos**.

---

## ⚡ Qué mirar en 5 minutos

| # | Paso | Qué verás |
|---|---|---|
| 1 | [README.md](README.md) | Historia principal, badges, diagrama de arquitectura |
| 2 | [PROJECT_STATUS.md](PROJECT_STATUS.md) | Estado consolidado v0.1.0 en una matriz |
| 3 | <http://localhost:9092> | El Control Center en vivo (si lo levantaste) |
| 4 | [labs.config.json](labs.config.json) | La fuente única de verdad del catálogo |
| 5 | [dashboard-server/server.js](dashboard-server/server.js) | El puente Windows ↔ WSL2 en Node.js |
| 6 | [launcher/windows/main.go](launcher/windows/main.go) | El launcher Go de un solo `.exe` |

Con ese recorrido se entiende la integración **Windows ↔ WSL2**, la arquitectura
de la línea de 3 repos y la capa de producto, sin revisar los 12 labs.

---

## 🧠 Qué demuestra este repo

| Skill demostrada | Evidencia concreta |
|---|---|
| 🪟 Integración Windows ↔ WSL2 | Control Center Node.js que ejecuta comandos en la distro vía `wsl.exe -d <distro> -- bash -lc` |
| 🏗️ Diseño de sistema | Arquitectura de 3 capas: UX Windows · control Node.js · runtime Linux |
| 🐧 Operación Linux | `service`/systemd, nginx, apache, postgres, flask, backup de distros |
| 🌐 API REST local | Endpoints `overview`, `health/:id`, `wsl/{start\|stop\|logs}` con `http` nativo |
| 🚀 Go | Launcher compilado a `.exe`, stdlib pura, sin dependencias, autodetección de distro |
| 📦 DevOps / CI-CD | GitHub Actions: docs, tests del dashboard, build del launcher/instalador |
| 🔒 Criterio de seguridad | Solo loopback, token opcional, rate-limit, comandos restringidos al catálogo |
| 📖 Documentación honesta | Se narra como Windows + WSL2 + localhost, sin prometer runtime Windows nativo |

---

## 🔀 Narrativa de portafolio

Este repo es parte de una **línea de tres laboratorios** sobre tecnologías para
montar sistemas, que comparten arquitectura (Control Center web + launcher
Windows + servicios en localhost):

| Repo | Motor | Qué muestra |
|---|---|---|
| [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs) | Docker / Compose | Reproducibilidad y operación de stacks |
| [`unikernel-labs`](https://github.com/vladimiracunadev-create/unikernel-labs) | Unikraft sobre WSL2 | Especialización y benchmarking de una suite local |
| **`wsl-labs`** | **WSL2 + servicios Linux nativos** | **Integración Windows ↔ Linux y operación de servicios reales** |

Donde `docker-labs` demuestra orquestación y `unikernel-labs` especialización,
`wsl-labs` demuestra la capacidad de **tender un puente entre Windows y Linux**
y operar servicios reales desde un panel, con la misma identidad visual y de
producto que sus hermanos.

---

## ⚙️ Stack técnico demostrado

```text
🪟 Windows   →  Node.js (Control Center) · Go (launcher) · PowerShell
🐧 Linux     →  WSL2 · service/systemd · nginx · apache+php · postgres · flask · bash
☁️ CI/CD     →  GitHub Actions · markdownlint · tests Node · build del .exe
```

---

## ✅ Lo que esta v0.1.0 sí promete

- Control local de servicios Linux **desde Windows** con un panel web
- Backend real en **WSL2** (no emulación)
- Puertos estables en **localhost**
- Un launcher `.exe` que levanta todo con un doble clic
- Una base coherente para crecer hacia benchmarks y más servicios

> [!NOTE]
> La documentación es honesta: `wsl-labs` no se declara "reemplazo de Docker
> Desktop" ni promete runtime Windows nativo para los servicios. Esa claridad
> técnica es parte de lo que el repo demuestra.

---

📖 Ver también: [README.md](README.md) · [ROADMAP.md](ROADMAP.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md)
