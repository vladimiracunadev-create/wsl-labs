# 📊 Project Status

> **Versión**: v0.1.0
> **Estado general**: 🟢 Operativo — Control Center + launcher + catálogo + 12 labs
> **Alcance actual**: 🧩 Panel Node.js en `:9092`, launcher Go, servicios Linux en localhost
> **Última actualización**: 2026-07-06

---

## 🧭 Resumen ejecutivo

`wsl-labs` ofrece una experiencia local completa para montar y operar sistemas
Linux sobre **WSL2 desde Windows**. El **Control Center** (Node.js, `:9092`)
arranca y monitorea servicios reales dentro de la distro vía `wsl.exe`, un
**launcher Go** levanta todo con un doble clic y `labs.config.json` es la fuente
única de verdad del catálogo de 12 labs. Con esta v0.1.0 el repo alcanza
**paridad estructural** con sus repos hermanos `docker-labs` y `unikernel-labs`.

---

## 🚀 Matriz de componentes

| Componente | Estado | Detalle |
|---|:---:|---|
| 📄 README con identidad visual | ✅ | Badges, Mermaid, tablas de labs y servicios |
| 🧭 Control Center (Node.js `:9092`) | ✅ | API `/api/overview`, `/api/health/:id`, `/api/wsl/*` |
| 🖥️ UI web (`index.html` + css + js) | ✅ | Panel de control con estado por lab |
| 🚀 Launcher Windows (Go) | ✅ | Verifica WSL2, arranca panel, abre browser |
| 📇 Catálogo `labs.config.json` | ✅ | Fuente única de verdad — 12 labs |
| 🐧 12 labs normalizados | ✅ | 6 servicios + 6 de aprendizaje |
| ⚙️ CI/CD (GitHub Actions) | ✅ | docs · dashboard · build-windows |
| 📚 Suite documental | ✅ | ENVIRONMENT, RUNBOOK, CONTRIBUTING, SECURITY, etc. |
| ⚖️ Licencia Apache-2.0 | ✅ | Alineada con la línea de repos |

---

## 📡 Estado de los servicios

| Servicio | Lab | Puerto | Estado |
|---|:---:|---:|:---:|
| 🧭 Control Center | — | 9092 | 🟢 Operativo |
| 🌐 nginx | 05 | 8080 | 🟢 Operativo |
| 🐘 apache + php | 06 | 8081 | 🟢 Operativo |
| 🟢 node API | 07 | 8082 | 🟢 Operativo |
| 🐍 flask | 08 | 8083 | 🟢 Operativo |
| 🗄️ postgresql | 09 | 5432 | 🟢 Operativo |
| 🧱 mini-servidor | 11 | 8090 | 🟢 Operativo |

---

## ✅ Lo consolidado

- Control Center Node.js operativo en `localhost:9092`, sin dependencias npm
- Puente Windows ↔ WSL2 vía `wsl.exe -d <distro> -- bash -lc`
- Launcher Go que levanta la plataforma en un doble clic
- Catálogo `labs.config.json` como única fuente de verdad
- 12 labs con README homogéneo (6 servicios + 6 de aprendizaje)
- CI/CD en GitHub Actions
- Suite documental por audiencia en español
- Licencia Apache-2.0

---

## 🚧 Lo que sigue en evolución

- 🧪 Más labs de servicio (ssh, mysql, docker-in-wsl) — ver [ROADMAP.md](ROADMAP.md)
- 📊 Benchmarks reproducibles WSL vs Docker vs VM
- 📦 Instalador `.exe` firmado y publicado por CI en cada tag
- 🎥 Demo grabada del flujo completo para portafolio
- 🖼️ Capturas y evidencias del Control Center en acción

---

## ⚠️ Riesgos o límites actuales

| Riesgo | Impacto |
|---|---|
| `sudo` con contraseña para servicios | El panel no arranca servicios hasta configurar `sudoers` |
| systemd no habilitado en la distro | Se usa `service` en lugar de `systemctl` |
| Instalador sin firma digital (v0.x) | Windows SmartScreen puede advertir |
| Node.js instalado dentro de WSL en vez de Windows | El Control Center no arranca |

---

## 📚 Recomendación de lectura

| Si quieres… | Abre |
|---|---|
| Entender la historia principal | [README.md](README.md) |
| Evaluar el repo rápido | [RECRUITER.md](RECRUITER.md) |
| Preparar el entorno | [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) |
| Operar el día a día | [RUNBOOK.md](RUNBOOK.md) |
| Ver el historial de cambios | [CHANGELOG.md](CHANGELOG.md) |
| Ver la dirección futura | [ROADMAP.md](ROADMAP.md) |

---

📖 Ver también: [README.md](README.md) · [ROADMAP.md](ROADMAP.md) · [COMPATIBILITY.md](COMPATIBILITY.md)
