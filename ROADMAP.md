# 🗺️ ROADMAP — WSL Control Center

> Historial de versiones y features planeadas.
> Para el estado actual del repo, consulta el [PROJECT_STATUS.md](PROJECT_STATUS.md).

---

## ✅ v0.1 — Control Center inicial _(actual)_

[![v0.1](https://img.shields.io/badge/v0.1-actual-brightgreen)](PROJECT_STATUS.md)

- [x] README con identidad visual (badges, Mermaid, tablas)
- [x] Control Center Node.js en `localhost:9092`
- [x] UI web (`index.html` + `dashboard.css` + `dashboard.js`)
- [x] Launcher Go (`.exe`) con autodetección de distro
- [x] Catálogo `labs.config.json` como fuente única de verdad
- [x] 12 labs normalizados (6 servicios + 6 aprendizaje)
- [x] CI/CD en GitHub Actions
- [x] Suite documental por audiencia (español)
- [x] Licencia Apache-2.0

---

## ⏳ v0.2 — Más labs de servicio

[![v0.2](https://img.shields.io/badge/v0.2-planificado-yellow)](CONTRIBUTING.md)

- [ ] 🔐 **Servidor SSH** en WSL (`ssh://localhost:2222`)
- [ ] 🐬 **MySQL / MariaDB** en WSL (`:3306`)
- [ ] 🐳 **Docker-in-WSL** — correr Docker Engine dentro de la distro
- [ ] Capturas y evidencias del flujo completo
- [ ] Instalador `.exe` publicado por CI al taggear `v*.*.*`

---

## 🔮 v0.3 — Benchmarks WSL vs Docker vs VM

[![v0.3](https://img.shields.io/badge/v0.3-planificado-blue)](docs/03-wsl-vs-docker-vs-vm.md)

- [ ] 📊 Benchmark reproducible: boot time, memoria, I/O
- [ ] Tabla comparativa **WSL2 vs Docker vs VM** con datos reales
- [ ] Dataset de benchmarks versionado en el repo
- [ ] Comparación directa con `docker-labs` y `unikernel-labs`
- [ ] Demo grabada del recorrido completo

---

## 📐 Principios de evolución

| Principio | Descripción |
|---|---|
| 🎯 Honestidad técnica | No prometer runtime Windows nativo donde no corresponde |
| 🪟 Windows es la UX | El modo de interacción principal sigue siendo Windows |
| 🐧 Linux es el runtime | WSL2 + servicios Linux reales siempre en el backend |
| 📇 Un catálogo raíz | `labs.config.json` controla puertos, comandos y health |
| ⚖️ Paridad con la línea | Misma arquitectura que `docker-labs` y `unikernel-labs` |

---

📖 Ver también: [PROJECT_STATUS.md](PROJECT_STATUS.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [RECRUITER.md](RECRUITER.md)
