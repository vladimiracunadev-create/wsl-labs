# 🗂️ Índice de Documentación — wsl-labs

> **Versión**: 0.1.2
> **Estado**: 🟢 Activo
> **Uso recomendado**: 📍 Empieza aquí si no sabes qué documento abrir primero.

---

## 🧭 Cómo usar este índice

Cada bloque agrupa documentos por necesidad real. La columna **Abrir** enlaza
directo para que la navegación funcione también desde GitHub. Las rutas con `../`
apuntan a la raíz del repo; las demás viven en `docs/`.

---

## 🚀 Inicio y operación

| Documento | Audiencia | Qué resuelve | Abrir |
| --- | --- | --- | --- |
| README | Todos | Portada, arquitectura y quickstart | [Abrir](../README.md) |
| Beginners Guide | Principiantes | Qué es WSL y orden de aprendizaje (labs 01→12) | [Abrir](BEGINNERS_GUIDE.md) |
| Install Guide | Todos | Instalación end-to-end (WSL2 + Ubuntu + panel) | [Abrir](INSTALL.md) |
| Requirements | Todos | Requisitos mínimos y recomendados del host y WSL | [Abrir](REQUIREMENTS.md) |
| Environment Setup | Operadores | Preparación paso a paso hasta abrir el panel | [Abrir](../ENVIRONMENT_SETUP.md) |
| User Manual | Usuarios del panel | Uso diario por casos + API REST | [Abrir](USER_MANUAL.md) |
| Dashboard Setup | Dev / DevOps | Arquitectura y operación del Control Center `:9092` | [Abrir](DASHBOARD_SETUP.md) |
| Operating Modes | Todos | Modos de uso (panel, terminal, learning, launcher) | [Abrir](../OPERATING-MODES.md) |
| Runbook | Operadores | Arranque, apagado y respuesta operativa rápida | [Abrir](../RUNBOOK.md) |
| Troubleshooting | Todos | Problemas comunes → causa → solución | [Abrir](TROUBLESHOOTING.md) |

---

## 🏗️ Arquitectura y referencia técnica

| Documento | Audiencia | Qué resuelve | Abrir |
| --- | --- | --- | --- |
| Architecture | Técnico | Arquitectura Windows↔WSL2 (diagramas Mermaid) | [Abrir](ARCHITECTURE.md) |
| Technical Specs | Técnico | Stacks, puertos, endpoints y contratos del catálogo | [Abrir](TECHNICAL_SPECS.md) |
| System Specs | Ejecutivo / técnico | Vista corta de componentes y capacidades | [Abrir](../SYSTEM_SPECS.md) |
| Labs Catalog | Todos | Rol narrativo de los 12 labs | [Abrir](LABS_CATALOG.md) |
| Labs Runtime Reference | Operadores | Servicio, puerto, arranque, health y RAM por lab | [Abrir](LABS_RUNTIME_REFERENCE.md) |
| File Architecture | Técnico | Mapa de carpetas y responsabilidades | [Abrir](../FILE_ARCHITECTURE.md) |
| Tooling | Técnico | Herramientas de runtime, desarrollo y CI | [Abrir](TOOLING.md) |
| Compatibility | Operadores | Compatibilidad por SO, puertos y modelo de operación | [Abrir](../COMPATIBILITY.md) |
| Glossary | Principiantes | Términos base de WSL y del workspace | [Abrir](../GLOSSARY.md) |

---

## 🐧 Fundamentos WSL

| Documento | Qué resuelve | Abrir |
| --- | --- | --- |
| Historia y referencia de WSL | Por qué Microsoft creó WSL, WSL1 vs WSL2 y referencia completa de comandos | [Abrir](wsl-historia-y-referencia.md) |
| ¿Qué es WSL? | Conceptos base de WSL/WSL2 | [Abrir](00-que-es-wsl.md) |
| Instalación de WSL | Instalar y configurar WSL 2 | [Abrir](01-instalacion-wsl.md) |
| Comandos básicos | Comandos de `wsl.exe` y del shell Linux | [Abrir](02-comandos-basicos.md) |
| WSL vs Docker vs VM | Comparativa con la línea de labs | [Abrir](03-wsl-vs-docker-vs-vm.md) |
| Buenas prácticas | Recomendaciones de uso (equivale a *Best Practices*) | [Abrir](04-buenas-practicas.md) |
| Cheatsheets | Resúmenes rápidos (WSL, Linux, systemd, redes) | [Abrir](../cheatsheets/) |

---

## 🪟 Distribución Windows

| Documento | Audiencia | Qué resuelve | Abrir |
| --- | --- | --- | --- |
| Windows Installer | Usuarios Windows, maintainers | Instalar el `.exe`, compilarlo, componentes, SmartScreen | [Abrir](windows-installer.md) |
| GitHub Releases Distribution | Maintainers | Distribución por Releases (binarios fuera del repo) | [Abrir](github-releases-distribution.md) |
| Technical Audit | Técnico | Hallazgos reales del desarrollo y correcciones aplicadas | [Abrir](technical-audit.md) |

---

## 📈 Estado, release y gobernanza

| Documento | Audiencia | Qué resuelve | Abrir |
| --- | --- | --- | --- |
| Project Status | Todos | Estado consolidado y áreas en evolución | [Abrir](../PROJECT_STATUS.md) |
| Roadmap | Todos | Dirección futura del proyecto | [Abrir](../ROADMAP.md) · [docs/05-roadmap](05-roadmap.md) |
| Changelog | Todos | Historial de cambios (0.1.0 → 0.1.2) | [Abrir](../CHANGELOG.md) |
| Release Guide | Maintainers | Checklist de release y publicación del instalador | [Abrir](../RELEASE.md) |
| Security | DevSecOps | Modelo de confianza (root en WSL) y reporte responsable | [Abrir](../SECURITY.md) |
| Contributing | Colaboradores | Flujo de contribución y cómo añadir un lab | [Abrir](../CONTRIBUTING.md) |
| Code of Conduct | Comunidad | Normas de convivencia | [Abrir](../CODE_OF_CONDUCT.md) |
| Support | Usuarios | Cómo obtener ayuda y qué información aportar | [Abrir](../SUPPORT.md) |
| Developing | Devs | Guía para extender y mantener el repo | [Abrir](../DEVELOPING.md) |
| Maintainers | Maintainers | Responsabilidades y revisión de PRs | [Abrir](MAINTAINERS.md) |

---

## 👀 Evaluación externa

| Documento | Audiencia | Qué resuelve | Abrir |
|---|---|---|---|
| Recruiter Guide | Reclutadores / managers | Lectura rápida de 5 min para evaluar el proyecto | [Abrir](../RECRUITER.md) |

---

## 🧭 Planificación y paridad de la línea

| Documento | Qué resuelve | Abrir |
| --- | --- | --- |
| Plan de paridad | Cómo wsl-labs igualó a docker-labs / unikernel-labs | [Abrir](PLAN_PARIDAD.md) |
| Mapping desde docker-labs | Equivalencias Docker → WSL (compose→service, imagen→apt…) | [Abrir](mapping-from-docker-labs.md) |

---

## ℹ️ Qué NO aplica a wsl-labs (a diferencia de docker-labs)

> [!NOTE]
> `wsl-labs` es una plataforma **local** (Windows + WSL2). Por diseño **no**
> incluye despliegue en la nube ni orquestación de clústeres. Estos documentos de
> `docker-labs` no tienen equivalente aquí:
>
> - **Kubernetes deployment** — no aplica: los servicios corren como demonios
>   Linux dentro de WSL, no en un clúster.
> - **AWS / cloud migration** — no aplica: no hay objetivo de despliegue remoto.
>   Para la vertiente cloud, ver el repo hermano
>   [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs).
>
> Además, algunas guías de `docker-labs` viven aquí con otro nombre:
> *Docker Basics* → [¿Qué es WSL?](00-que-es-wsl.md) + [Comandos básicos](02-comandos-basicos.md);
> *Best Practices* → [Buenas prácticas](04-buenas-practicas.md);
> *Platform Roadmap* → [Roadmap](../ROADMAP.md).

---

📖 Punto de entrada: [README](../README.md) · Operación diaria: [RUNBOOK](../RUNBOOK.md) · Contribuir: [CONTRIBUTING](../CONTRIBUTING.md)
