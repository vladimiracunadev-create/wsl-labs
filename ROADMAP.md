# 🗺️ ROADMAP — WSL Container Center

> Historial de versiones y features planeadas.
> Para el estado actual del repo, consulta el [PROJECT_STATUS.md](PROJECT_STATUS.md).

---

## ✅ v0.3 — 12 casos de contenedores con WSLC _(actual)_

[![v0.3](https://img.shields.io/badge/v0.3-actual-brightgreen)](PROJECT_STATUS.md)

- [x] Panel Node.js en `localhost:9092` con endpoints `wslc`
      (`GET /api/wslc/overview`, `POST /api/wslc/{build,up,down,logs}`)
- [x] Motor **WSLC** integrado (`C:\Program Files\WSL\wslc.exe`, WSL 2.9+ preview)
- [x] **12 casos** portados de `docker-labs`, verificados corriendo con `wslc`
- [x] 4 starter + 4 platform (red `wslc`) + 4 infra
- [x] Imágenes custom con `wslc build` desde Dockerfiles (incluye multi-stage)
- [x] Catálogo `containers/containers.config.json` como fuente única de verdad
- [x] Launcher Go (`.exe`) con autodetección de distro
- [x] CI/CD en GitHub Actions
- [x] Licencia Apache-2.0

---

## ⏳ v0.4 — Más casos y persistencia

[![v0.4](https://img.shields.io/badge/v0.4-planificado-yellow)](CONTRIBUTING.md)

- [ ] 🧪 **Más casos de contenedores** (colas adicionales, otras bases, gateways)
- [ ] 💾 **Volúmenes persistentes** por caso (`wslc volume`) para datos que sobreviven al `down`
- [ ] 🩺 **Healthchecks avanzados** (readiness, reintentos, umbrales por servicio)
- [ ] 🖼️ Capturas y evidencias del panel operando los casos

---

## 🔮 v0.5 — Orquestación multi-contenedor

[![v0.5](https://img.shields.io/badge/v0.5-planificado-blue)](docs/wslc-contenedores.md)

- [ ] 🧩 **`wslc-compose`** si Microsoft lo publica — hoy el multi-contenedor se arma
      a mano con red `wslc` + varios `wslc run`
- [ ] 📊 Benchmark reproducible: `wslc` vs Docker (boot time, memoria, I/O)
- [ ] Comparación directa con `docker-labs` y `unikernel-labs`
- [ ] Demo grabada del recorrido completo

---

## 📐 Principios de evolución

| Principio | Descripción |
| --- | --- |
| 🎯 Honestidad técnica | Se documenta que `wslc` está en preview y qué se verificó de verdad |
| 🪟 Windows es la UX | El modo de interacción principal sigue siendo Windows (panel + launcher) |
| 🐳 Contenedores reales | Imágenes OCI y contenedores `wslc`, no emulación ni demonios `apt` |
| 📇 Un catálogo raíz | `containers/containers.config.json` controla imágenes, puertos, redes y health |
| ⚖️ Paridad con la línea | Mismos casos que `docker-labs`, con el motor nativo de WSL |

---

📖 Ver también: [PROJECT_STATUS.md](PROJECT_STATUS.md) · [docs/wslc-contenedores.md](docs/wslc-contenedores.md) · [RECRUITER.md](RECRUITER.md)
