# 📖 Glossary

> **Estado**: Activo
> **Uso recomendado**: Lectura rápida cuando un término de `wsl-labs` no se
> entiende a la primera. Ideal para principiantes.

---

## 🐧 Términos WSL

| Término | Significado |
| --- | --- |
| **WSL** | *Windows Subsystem for Linux*. Capa que permite correr Linux dentro de Windows |
| **WSL 2** | Segunda generación de WSL: usa un kernel Linux real sobre una VM ligera; es el modo soportado por este repo |
| **Distro** | Distribución Linux instalada en WSL (aquí, **Ubuntu** por defecto) |
| **Instancia WSL** | La distro en ejecución. Se puede apagar con `wsl --shutdown` |
| **`wsl.exe`** | El ejecutable de Windows que controla WSL (`wsl -l -v`, `wsl -d Ubuntu -- …`) |
| **systemd** | Gestor de servicios de Linux. Se habilita en `/etc/wsl.conf`; node/flask lo usan |
| **Interoperabilidad** | Que Windows y WSL compartan archivos y `localhost` entre sí |

---

## 🧭 Términos del workspace

| Término | Significado |
| --- | --- |
| **Control Center** | Panel principal Node.js en `localhost:9092`; puente Windows ↔ WSL |
| **Launcher** | App de Windows (Go `.exe`) que verifica WSL2, arranca el panel y abre el navegador |
| **Catálogo** | `labs.config.json`: **fuente única de verdad** de labs, puertos, comandos y health |
| **Lab service** | Lab que expone un servicio en un puerto (nginx, apache, node, flask, postgres, mini) |
| **Lab learning** | Lab que es solo guía conceptual, sin servicio ni puerto |
| **Keepalive** | Mecanismo que mantiene viva la instancia WSL mientras el panel corre, para que los servicios no se caigan |

---

## 🔧 Términos operativos

| Término | Significado |
| --- | --- |
| **Instalar** | Correr el `install-*.sh` de un servicio (botón 📦, o `POST /api/wsl/install`) |
| **Levantar** | Arrancar el servicio (botón ▶, o `POST /api/wsl/start`) |
| **Detener** | Parar el servicio (`POST /api/wsl/stop`) sin desinstalarlo |
| **Health** | Chequeo de salud del servicio en su puerto (`http`, `tcp` o `null`) |
| **`healthy` / `degraded` / `stopped` / `n/a`** | Estados que devuelve el panel: sano ✅ / puerto abierto con error ⚠️ / caído ⏹ / lab de aprendizaje 📚 |
| **Passwordless sudo** | `sudo` sin contraseña. **Solo** para operar por terminal con `make up-*`; el panel no lo necesita (usa `-u root`) |
| **`$WSL_LABS_ROOT`** | Marcador en los comandos del catálogo; el servidor lo sustituye por la ruta literal del repo |
| **Idempotente** | Que puede ejecutarse varias veces con el mismo resultado (los `install-*.sh` lo son) |

---

## 📦 Términos de distribución (Windows)

| Término | Significado |
| --- | --- |
| **`version.txt`** | Fuente única de la versión del proyecto |
| **Tag `vX.Y.Z`** | Etiqueta git que dispara el build del instalador en GitHub Actions |
| **Inno Setup** | Herramienta que empaqueta el launcher en el instalador `wsl-labs-setup-X.Y.Z.exe` |
| **Release** | Publicación en GitHub con el `.exe` adjunto como asset |
| **Firma digital** | Firma de código del instalador; **no** se usa en v0.x (decisión explícita) |

---

## ⚙️ Términos de CI/CD

| Workflow | Qué hace |
| --- | --- |
| `docs.yml` | Lint de Markdown (markdownlint-cli2) |
| `scripts.yml` | Lint de `*.sh` (shellcheck) y `*.ps1` (PSScriptAnalyzer) |
| `dashboard.yml` | Verifica el catálogo y el dashboard (`verify-localhost.js`) |
| `build-windows.yml` | Compila launcher + instalador al pushear un tag `vX.Y.Z` |

---

📖 Ver también: [FAQ.md](FAQ.md) · [OPERATING-MODES.md](OPERATING-MODES.md) · [RUNBOOK.md](RUNBOOK.md) · [docs/00-que-es-wsl.md](docs/00-que-es-wsl.md)
