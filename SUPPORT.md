# 🤝 Support

Guía breve para pedir ayuda con `wsl-labs`.

---

## 📚 Antes de reportar

Revisa primero, en este orden:

- [README.md](README.md) — visión general y quickstart
- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) — preparar Windows + WSL + `wslc`
- [RUNBOOK.md](RUNBOOK.md) — operación diaria del panel y los contenedores
- [FAQ.md](FAQ.md) — preguntas frecuentes (¿necesito Docker?, ¿qué es `wslc`?…)
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) — diagnóstico

> [!TIP]
> Muchos problemas se resuelven confirmando el motor:
> `wsl --version` (WSL 2.9+) y `& "C:\Program Files\WSL\wslc.exe" version`.
> Si el panel no abre, confirma que Node.js responde en Windows (`node --version`,
> ≥ 18).

---

## 🆘 Cómo pedir ayuda

- 🐛 Abre un **issue** si hay un bug reproducible.
- 💡 Abre una **discussion** si quieres proponer una mejora o resolver una duda.

Repositorio: <https://github.com/vladimiracunadev-create/wsl-labs>

---

## 🧾 Qué incluir en un reporte útil

| Dato | Ejemplo |
| --- | --- |
| Caso o componente | `04-redis-cache` / panel / launcher `.exe` |
| Versión de `wsl-labs` | contenido de `version.txt` (p. ej. `0.1.2`) |
| Windows | Windows 11 23H2 |
| WSL | salida de `wsl --version` (debe ser 2.9+) |
| Motor `wslc` | salida de `& "C:\Program Files\WSL\wslc.exe" version` |
| Node.js | `node --version` en Windows |
| Comando ejecutado | endpoint `/api/wslc/up` o el `wslc build/run …` usado |
| Resultado esperado vs real | "esperaba HTTP 200 en `:8101`, el contenedor no arranca" |
| Logs | salida de `/api/wslc/logs` o `& "C:\Program Files\WSL\wslc.exe" logs <contenedor>` |

---

## 🎯 Alcance del soporte

Este repositorio está orientado a:

- 🐳 aprendizaje práctico de **contenedores con `wslc`** en `localhost`
- 🧪 prototipado local sobre Windows sin Docker Desktop
- 🧱 construcción progresiva de un catálogo de casos portados de `docker-labs`

> [!NOTE]
> `wsl-labs` es **local only**: no cubre despliegues en cloud ni Kubernetes, y no
> promete soporte de producción ni SLA. El panel corre solo en `localhost` por
> diseño (ver [SECURITY.md](SECURITY.md)). Las guías de fundamentos de WSL
> (`docs/00-05`) quedan como documentación de contexto.

---

📖 Ver también: [FAQ.md](FAQ.md) · [RUNBOOK.md](RUNBOOK.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [GLOSSARY.md](GLOSSARY.md)
