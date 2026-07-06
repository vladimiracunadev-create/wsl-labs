# 🤝 Support

Guía breve para pedir ayuda con `wsl-labs`.

---

## 📚 Antes de reportar

Revisa primero, en este orden:

- [README.md](README.md) — visión general y quickstart
- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) — preparar Windows + WSL2
- [RUNBOOK.md](RUNBOOK.md) — operación diaria del Control Center
- [FAQ.md](FAQ.md) — preguntas frecuentes (¿pide contraseña?, ¿necesito Docker?…)
- [labs/12-troubleshooting/](labs/12-troubleshooting/) — diagnóstico de WSL

> [!TIP]
> Muchos problemas se resuelven con `wsl --status` y `wsl -l -v`. Si el panel no
> abre, confirma que Node.js responde en Windows (`node --version`, ≥ 18).

---

## 🆘 Cómo pedir ayuda

- 🐛 Abre un **issue** si hay un bug reproducible.
- 💡 Abre una **discussion** si quieres proponer una mejora o resolver una duda.

Repositorio: <https://github.com/vladimiracunadev-create/wsl-labs>

---

## 🧾 Qué incluir en un reporte útil

| Dato | Ejemplo |
| --- | --- |
| Lab o componente | `05-servidor-web-nginx` / Control Center / launcher `.exe` |
| Versión de `wsl-labs` | contenido de `version.txt` (p. ej. `0.1.2`) |
| Windows | Windows 11 23H2 |
| WSL | salida de `wsl --status` y `wsl -l -v` |
| Distro | Ubuntu (versión) |
| Node.js | `node --version` en Windows |
| Comando ejecutado | endpoint `/api/wsl/start` o el `make`/`wsl bash …` usado |
| Resultado esperado vs real | "esperaba HTTP 200 en `:8080`, obtuve `stopped`" |
| Logs | salida de `/api/wsl/logs` o `wsl -d Ubuntu -- bash -lc "journalctl -u wsl-labs-node -n 50"` |

---

## 🎯 Alcance del soporte

Este repositorio está orientado a:

- 🐧 aprendizaje práctico de **WSL2** y servicios Linux en `localhost`
- 🧪 prototipado local sobre Windows
- 🧱 construcción progresiva de una plataforma modular (Control Center + labs)

> [!NOTE]
> `wsl-labs` es **local only**: no cubre despliegues en cloud ni Kubernetes, y
> no promete soporte de producción ni SLA. El Control Center corre solo en
> `localhost` por diseño (ver [SECURITY.md](SECURITY.md)).

---

📖 Ver también: [FAQ.md](FAQ.md) · [RUNBOOK.md](RUNBOOK.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [GLOSSARY.md](GLOSSARY.md)
