# 🗂️ Índice de Documentación — wsl-labs

> **Versión**: 0.3.0
> **Estado**: 🟢 Activo · **WSL Container Center** (control de contenedores con `wslc`)
> **Uso recomendado**: 📍 Empieza aquí si no sabes qué documento abrir primero.

---

## 🚀 Inicio y operación

| Documento | Qué resuelve | Abrir |
|---|---|---|
| README | Portada, arquitectura y quickstart | [Abrir](../README.md) |
| Beginners Guide | Qué es un contenedor y `wslc`; recorrido por los casos | [Abrir](BEGINNERS_GUIDE.md) |
| Install Guide | Instalación end-to-end (WSL2 + `wslc` + panel) | [Abrir](INSTALL.md) |
| Requirements | Requisitos del host, WSL 2.9+ y RAM | [Abrir](REQUIREMENTS.md) |
| Environment Setup | Preparación paso a paso hasta el primer contenedor | [Abrir](../ENVIRONMENT_SETUP.md) |
| User Manual | Uso diario del panel por casos + API REST | [Abrir](USER_MANUAL.md) |
| Dashboard Setup | Arquitectura y operación del panel `:9092` | [Abrir](DASHBOARD_SETUP.md) |
| Operating Modes | Modos de uso (panel, terminal, launcher) | [Abrir](../OPERATING-MODES.md) |
| Runbook | Operación diaria y respuesta rápida | [Abrir](../RUNBOOK.md) |
| Troubleshooting | Problemas comunes → solución | [Abrir](TROUBLESHOOTING.md) |

---

## 🐳 Contenedores (WSLC)

| Documento | Qué resuelve | Abrir |
|---|---|---|
| Guía WSLC | Qué es `wslc`, ciclo de vida, comandos `wslc` ↔ `docker` | [Abrir](wslc-contenedores.md) |
| Referencia CLI de `wslc` | Todos los comandos y opciones de `wslc` (container/image/network/volume/…) | [Abrir](wslc-cli-referencia.md) |
| Catálogo de casos | Rol de los 12 casos (starter/platform/infra) | [Abrir](LABS_CATALOG.md) |
| Runtime reference | Imagen, puerto, comando, red, health y RAM por caso | [Abrir](LABS_RUNTIME_REFERENCE.md) |
| Mapping docker-labs → wslc | Equivalencias Docker → WSLC caso a caso | [Abrir](mapping-from-docker-labs.md) |
| Casos (carpetas) | README por caso | [Abrir](../containers/) |

---

## 🏗️ Arquitectura y referencia técnica

| Documento | Qué resuelve | Abrir |
|---|---|---|
| Architecture | Windows (panel `:9092` → `wslc.exe`) → contenedores | [Abrir](ARCHITECTURE.md) |
| Technical Specs | Stacks, puertos, endpoints y esquema del catálogo | [Abrir](TECHNICAL_SPECS.md) |
| System Specs | Vista corta de componentes y capacidades | [Abrir](../SYSTEM_SPECS.md) |
| File Architecture | Mapa de carpetas y responsabilidades | [Abrir](../FILE_ARCHITECTURE.md) |
| Tooling | `wslc`, Node, Go, Inno Setup, GitHub Actions | [Abrir](TOOLING.md) |
| Compatibility | Compatibilidad por SO, WSL 2.9+ y RAM | [Abrir](../COMPATIBILITY.md) |
| Glossary | Glosario de términos de contenedores y WSL | [Abrir](../GLOSSARY.md) |

---

## 🐧 WSL (documentación de contexto)

> WSL es la plataforma que hace posible `wslc`. Su historia, fundamentos y comandos
> se conservan como **documentación** — no como el foco operativo del repo.

| Documento | Qué resuelve | Abrir |
|---|---|---|
| Historia y referencia de WSL | Por qué existe WSL, WSL1 vs WSL2, WSLC y comandos | [Abrir](wsl-historia-y-referencia.md) |
| ¿Qué es WSL? | Conceptos base | [Abrir](00-que-es-wsl.md) |
| Instalación de WSL | Instalar y configurar WSL 2 | [Abrir](01-instalacion-wsl.md) |
| Comandos básicos | `wsl.exe` y shell Linux | [Abrir](02-comandos-basicos.md) |
| WSL vs Docker vs VM | Comparativa | [Abrir](03-wsl-vs-docker-vs-vm.md) |
| Buenas prácticas | Recomendaciones | [Abrir](04-buenas-practicas.md) |
| Cheatsheets | Chuletas WSL/Linux/redes | [Abrir](../cheatsheets/) |

---

## 🪟 Distribución Windows

| Documento | Qué resuelve | Abrir |
|---|---|---|
| Windows Installer | Instalar y compilar el `.exe` | [Abrir](windows-installer.md) |
| GitHub Releases Distribution | Distribución por GitHub Releases | [Abrir](github-releases-distribution.md) |
| Technical Audit | Auditoría del giro a contenedores | [Abrir](technical-audit.md) |

---

## 📈 Estado, release y gobernanza

| Documento | Qué resuelve | Abrir |
|---|---|---|
| Project Status | Estado v0.3.0 (12 casos verificados) | [Abrir](../PROJECT_STATUS.md) |
| Roadmap | Dirección futura | [Abrir](../ROADMAP.md) |
| Changelog | Historial de cambios | [Abrir](../CHANGELOG.md) |
| Release Guide | Checklist de release | [Abrir](../RELEASE.md) |
| Security | Modelo de confianza y reporte | [Abrir](../SECURITY.md) |
| Contributing | Cómo añadir un caso | [Abrir](../CONTRIBUTING.md) |
| Code of Conduct | Normas de convivencia | [Abrir](../CODE_OF_CONDUCT.md) |
| Support | Cómo obtener ayuda | [Abrir](../SUPPORT.md) |
| Developing | Extender y mantener el repo | [Abrir](../DEVELOPING.md) |
| Maintainers | Responsabilidades del mantenedor | [Abrir](MAINTAINERS.md) |

---

## 👀 Evaluación externa

| Documento | Qué resuelve | Abrir |
|---|---|---|
| Recruiter Guide | Recorrido de 5 min para evaluar el proyecto | [Abrir](../RECRUITER.md) |

---

📖 Punto de entrada: [README](../README.md) · Operación: [RUNBOOK](../RUNBOOK.md) · Contribuir: [CONTRIBUTING](../CONTRIBUTING.md)
