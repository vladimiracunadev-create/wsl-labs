# 🧰 Tooling — WSL Labs

> **Versión**: 0.1.2
> **Estado**: 🟢 Activo
> **Uso recomendado**: Referencia corta de herramientas para operar, desarrollar y mantener el workspace

---

## 🐧 Herramientas de runtime

Lo mínimo para **ejecutar** el sistema y sus servicios.

| Herramienta | Uso |
| --- | --- |
| WSL 2 | Runtime Linux dentro de Windows; reexpone puertos en `localhost` |
| Ubuntu (distro) | Sistema base donde viven los servicios |
| `wsl.exe` | Puente Windows → WSL (`-d Ubuntu -u root -- bash -lc "<cmd>"`) |
| systemd | Gestiona servicios; unidades propias `wsl-labs-node` y `wsl-labs-flask` |
| `systemctl` / `systemd-run` | Habilitar, arrancar y consultar servicios |
| `service` | Arranque de nginx / apache2 / postgresql |
| `apt` | Instalación de paquetes en la distro |
| `ss` | Inspección de puertos abiertos en WSL |
| `curl` | Comprobación manual de endpoints en `localhost` |
| Node.js 18+ | Motor del Control Center (módulo `http` nativo, sin npm) |

---

## 🛠️ Herramientas de desarrollo

Para **construir, versionar y compilar** los componentes.

| Herramienta | Uso |
| --- | --- |
| Go 1.21+ | Compilar el launcher Windows (`go build`, stdlib puro) |
| Inno Setup | Empaquetar el instalador `.exe` (`installer/wsl-labs.iss`) |
| Git | Versionado y publicación |
| PowerShell / Windows Terminal | Operación local en Windows |
| Bash | Scripts `install-*.sh`, `doctor.sh`, `setup-passwordless-sudo.sh` |
| Make | Targets de automatización (`make serve`, `make status`) |

> [!NOTE]
> El launcher no tiene dependencias externas (solo la stdlib de Go) y el Control
> Center no tiene dependencias npm (solo el módulo `http`). Ambos compilan/corren
> sin descargar paquetes.

---

## 🤖 Herramientas de calidad y CI

Automatizan la validación en cada push/PR y la publicación de releases.

| Herramienta | Uso |
| --- | --- |
| GitHub Actions | Orquesta los workflows del repo |
| markdownlint | Linter de la documentación (workflow `docs`) |
| shellcheck | Análisis estático de los `scripts/*.sh` (workflow `scripts`) |
| Node test runner | Tests del Control Center (workflow `dashboard`) |
| Chocolatey | Instala Inno Setup en el runner de CI (`build-windows`) |

### Workflows

| Workflow | Trigger | Rol |
| --- | --- | --- |
| `docs` | push / PR | markdownlint |
| `scripts` | push / PR | shellcheck |
| `dashboard` | push / PR | tests Node del panel |
| `build-windows` | tag `v*.*.*` | compila launcher + instalador y publica en Releases |

---

## 🩺 Scripts operativos

| Script | Uso |
| --- | --- |
| `scripts/install-*.sh` | Instaladores idempotentes por servicio (nginx, apache-php, node, python, postgresql) |
| `scripts/install-base.sh` | Prepara la distro con los paquetes base |
| `scripts/setup-passwordless-sudo.sh` | Opcional: sudo sin contraseña para uso por terminal |
| `scripts/doctor.sh` | Diagnóstico del entorno WSL |

---

## 📚 Documentos relacionados

- [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [../ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md)
- [../RUNBOOK.md](../RUNBOOK.md)
