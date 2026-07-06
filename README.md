# 🐧 wsl-labs

![WSL Control Center](assets/branding/cover.svg)

**Suite de laboratorios para montar, administrar y automatizar sistemas Linux
con Windows Subsystem for Linux (WSL 2)** — con Control Center web, launcher de
Windows y servicios reales publicados en `localhost`.

[![Docs](https://github.com/vladimiracunadev-create/wsl-labs/actions/workflows/docs.yml/badge.svg)](https://github.com/vladimiracunadev-create/wsl-labs/actions/workflows/docs.yml)
[![Dashboard](https://github.com/vladimiracunadev-create/wsl-labs/actions/workflows/dashboard.yml/badge.svg)](https://github.com/vladimiracunadev-create/wsl-labs/actions/workflows/dashboard.yml)
[![Build Windows](https://github.com/vladimiracunadev-create/wsl-labs/actions/workflows/build-windows.yml/badge.svg)](https://github.com/vladimiracunadev-create/wsl-labs/actions/workflows/build-windows.yml)
[![Release](https://img.shields.io/github/v/release/vladimiracunadev-create/wsl-labs?sort=semver)](https://github.com/vladimiracunadev-create/wsl-labs/releases)
![Platform](https://img.shields.io/badge/Platform-Windows%2011%20%2B%20WSL2-orange)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

> [!NOTE]
> `wsl-labs` es parte de una línea de laboratorios sobre **tecnologías para
> montar sistemas**, junto a
> [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs) (contenedores)
> y [`unikernel-labs`](https://github.com/vladimiracunadev-create/unikernel-labs) (unikernels).
> Los tres comparten arquitectura: Control Center web + launcher Windows + servicios en localhost.

---

## 🗺️ Qué es este repo

WSL no es solo una terminal Linux dentro de Windows: es una plataforma para
levantar **servicios reales** (web, apps, bases de datos) accesibles desde
`localhost` de Windows. Este repo lo convierte en un panel operable:

| Pieza | Rol |
|-------|-----|
| 🧭 **Control Center** (Node.js, `:9092`) | Arranca/detiene servicios WSL y muestra su salud |
| 🪟 **Launcher Windows** (Go `.exe`) | Detecta la distro, levanta el stack y abre el navegador |
| 🐧 **12 labs** (`labs/NN-*`) | Guías paso a paso: instalación, systemd, nginx, apache, node, python, postgres, backup… |
| 📇 **`labs.config.json`** | Fuente única de verdad del catálogo (puertos, comandos, health) |

### Arquitectura

```mermaid
flowchart LR
    subgraph WIN["🪟 Windows 11"]
        L["Launcher .exe"]
        B["Navegador"]
        D["🧭 Control Center<br/>Node.js :9092"]
    end
    subgraph WSL["🐧 WSL2 · Ubuntu"]
        N["nginx :8080"]
        A["apache+php :8081"]
        NO["node :8082"]
        P["flask :8083"]
        PG["postgresql :5432"]
    end
    L --> D
    B --> D
    D -->|wsl.exe -d Ubuntu| WSL
```

---

## 🚀 Quickstart

```powershell
# 1. Instalar WSL 2 + Ubuntu (reinicia si es la primera vez)
wsl --install

# 2. Clonar el repo
git clone https://github.com/vladimiracunadev-create/wsl-labs.git
cd wsl-labs

# 3. Preparar la distro (dentro de WSL)
wsl bash scripts/install-base.sh

# 4. Levantar el Control Center
make serve            # o: node dashboard-server/server.js
```

Abre **<http://localhost:9092>** y controla los servicios desde el panel.
El panel instala y levanta cada servicio con un clic, como Docker (corre
privilegiado en WSL, sin contraseñas): **📦 Instalar → ▶ Levantar**.

> [!TIP]
> ¿Prefieres un `.exe`? Descarga el **Launcher** desde
> [Releases](https://github.com/vladimiracunadev-create/wsl-labs/releases): levanta
> el stack y abre el navegador por ti.

---

## 🌐 Servicios en localhost

| Servicio | Lab | Puerto | URL |
|----------|-----|:------:|-----|
| 🧭 Control Center | — | 9092 | <http://localhost:9092> |
| 🌐 NGINX | 05 | 8080 | <http://localhost:8080> |
| 🐘 Apache + PHP | 06 | 8081 | <http://localhost:8081> |
| 🟢 Node API | 07 | 8082 | <http://localhost:8082> |
| 🐍 Flask | 08 | 8083 | <http://localhost:8083> |
| 🗄️ PostgreSQL | 09 | 5432 | `postgres://localhost:5432` |

---

## 🧪 Labs disponibles

| # | Lab | Tipo | Estado | Puerto |
|---|-----|------|:------:|:------:|
| 01 | [Instalación Ubuntu](labs/01-instalacion-ubuntu/) | 📚 learning | ✅ | — |
| 02 | [Comandos base WSL](labs/02-comandos-base-wsl/) | 📚 learning | ✅ | — |
| 03 | [Sistema de archivos](labs/03-sistema-de-archivos/) | 📚 learning | ✅ | — |
| 04 | [systemd y servicios](labs/04-systemd-servicios/) | 📚 learning | ✅ | — |
| 05 | [Servidor web NGINX](labs/05-servidor-web-nginx/) | ⚙️ service | ✅ | 8080 |
| 06 | [Apache + PHP](labs/06-servidor-apache-php/) | ⚙️ service | ✅ | 8081 |
| 07 | [Node.js entorno dev](labs/07-nodejs-entorno-dev/) | ⚙️ service | ✅ | 8082 |
| 08 | [Python entorno dev](labs/08-python-entorno-dev/) | ⚙️ service | ✅ | 8083 |
| 09 | [PostgreSQL en WSL](labs/09-postgresql-en-wsl/) | ⚙️ service | ✅ | 5432 |
| 10 | [Backup export/import](labs/10-backup-export-import/) | 📚 learning | ✅ | — |
| 11 | [Mini-servidor completo](labs/11-mini-servidor-completo/) | ⚙️ service | ✅ | 8090 |
| 12 | [Troubleshooting](labs/12-troubleshooting/) | 📚 learning | ✅ | — |

---

## 📖 Documentación

| Documento | Para quién |
|-----------|-----------|
| [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) | Preparar Windows + WSL2 paso a paso |
| [RUNBOOK.md](RUNBOOK.md) | Operación diaria del Control Center |
| [docs/00-que-es-wsl.md](docs/00-que-es-wsl.md) | Fundamentos de WSL |
| [docs/03-wsl-vs-docker-vs-vm.md](docs/03-wsl-vs-docker-vs-vm.md) | Comparativa con la línea |
| [docs/PLAN_PARIDAD.md](docs/PLAN_PARIDAD.md) | Plan de paridad con los repos hermanos |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Cómo añadir un lab |
| [RECRUITER.md](RECRUITER.md) | Recorrido de 5 min para reclutadores |
| [ROADMAP.md](ROADMAP.md) | Hacia dónde va el proyecto |

---

## 🧱 Requisitos

- Windows 10 (2004+) o Windows 11 · **WSL 2**
- Una distro Linux (Ubuntu/Debian recomendada)
- Node.js 18+ (para el Control Center) · Go 1.21+ (solo para compilar el launcher)
- Git · PowerShell / Windows Terminal

---

## ⚖️ Licencia

[Apache License 2.0](LICENSE) · Copyright 2026 vladimiracunadev-create
