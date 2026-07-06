# 🏗️ FILE_ARCHITECTURE — WSL Control Center v1

> Árbol comentado del repositorio y guía de qué editar / qué no.
> Para el contexto de cada componente, consulta el [README.md](README.md).

---

## 🌳 Árbol de archivos

```text
wsl-labs/
│
├── labs/
│   ├── 01-instalacion-ubuntu/     # 📚 Instalar WSL2 + Ubuntu desde cero
│   ├── 02-comandos-base-wsl/      # 📚 Comandos de wsl.exe y del shell Linux
│   ├── 03-sistema-de-archivos/    # 📚 Interop Windows <-> WSL y rendimiento
│   ├── 04-systemd-servicios/      # 📚 Habilitar systemd y administrar servicios
│   ├── 05-servidor-web-nginx/     # ⚙️ NGINX en localhost:8080
│   ├── 06-servidor-apache-php/    # ⚙️ Apache + PHP en localhost:8081
│   ├── 07-nodejs-entorno-dev/     # ⚙️ API Node.js en localhost:8082
│   ├── 08-python-entorno-dev/     # ⚙️ App Flask en localhost:8083
│   ├── 09-postgresql-en-wsl/      # ⚙️ PostgreSQL en localhost:5432
│   ├── 10-backup-export-import/   # 📚 Exportar/importar/clonar distros WSL
│   ├── 11-mini-servidor-completo/ # ⚙️ Stack combinado en localhost:8090
│   └── 12-troubleshooting/        # 📚 Diagnóstico de problemas en WSL
│
├── dashboard-server/
│   ├── server.js                  # 🌐 Control Center — API + estáticos (Node http nativo)
│   └── verify-localhost.js        # 🧪 Smoke test del flujo localhost
│
├── launcher/
│   └── windows/
│       └── main.go                # 🚀 Launcher Go (.exe) — arranca todo y abre el browser
│
├── examples/
│   ├── node-api/server.js         # Servicio de ejemplo consumido por el lab 07
│   └── python-flask/app.py        # Servicio de ejemplo consumido por el lab 08
│
├── scripts/
│   └── install-base.sh            # Instala paquetes de servicio dentro de WSL
│
├── docs/
│   ├── 00-que-es-wsl.md           # Fundamentos de WSL
│   ├── 01-instalacion-wsl.md      # Guía de instalación
│   ├── 02-comandos-basicos.md     # Referencia de comandos
│   ├── 03-wsl-vs-docker-vs-vm.md  # Comparativa de la línea
│   ├── 04-buenas-practicas.md     # Recomendaciones
│   ├── 05-roadmap.md              # Notas de evolución
│   ├── PLAN_PARIDAD.md            # Plan de paridad con repos hermanos
│   └── mapping-from-docker-labs.md # 🔀 Mapeo de conceptos docker-labs -> WSL
│
├── cheatsheets/                   # comandos-wsl, comandos-linux, systemd, redes…
├── assets/branding/               # cover.svg, logo (identidad visual de la línea)
├── .github/                       # workflows CI + ISSUE_TEMPLATE + PR template
│
├── index.html                     # 🌐 UI del Control Center
├── dashboard.css                  # 🎨 Estilos del Control Center
├── dashboard.js                   # ⚡ Lógica del Control Center
│
├── labs.config.json               # 📇 CATÁLOGO RAÍZ — fuente única de verdad
├── Makefile                       # Targets de automatización (serve, status…)
├── version.txt                    # Versión canónica del proyecto
├── README.md                      # Punto de entrada del repositorio
└── LICENSE                        # Apache-2.0
```

---

## 🔑 Qué editar / qué no

| Archivo | Rol | ¿Editar? |
|---|---|:---:|
| `labs.config.json` | Fuente de verdad del catálogo (puertos, comandos, health) | ✅ **Editar aquí** |
| `labs/NN-*/README.md` | Guía de cada lab | ✅ |
| `dashboard-server/server.js` | Backend localhost que conecta Windows con WSL2 | ✅ |
| `dashboard-server/verify-localhost.js` | Valida el flujo local del Control Center | ✅ |
| `launcher/windows/main.go` | Launcher Go | ✅ |
| `index.html` · `dashboard.css` · `dashboard.js` | UI del Control Center | ✅ |
| `scripts/install-base.sh` | Instalador de paquetes en WSL | ✅ |
| `version.txt` | Versión canónica | ✅ (al publicar release) |
| `wsl-labs-launcher.exe` | Binario compilado del launcher | ❌ Se genera con `go build` |
| Puertos hardcodeados en la UI | — | ❌ No los dupliques; salen del catálogo |

> [!IMPORTANT]
> `labs.config.json` es la **única fuente de verdad**. El Control Center y el
> launcher lo leen directamente. Si cambias un puerto o comando, hazlo ahí y
> refléjalo en el README del lab afectado.

---

## 🔄 Flujo de datos del catálogo

```text
[1] labs.config.json               ← fuente de verdad (puertos, comandos, health)
        │
        ├─▶ dashboard-server/server.js   → GET /api/overview, /api/health/:id
        │                                  POST /api/wsl/{start|stop|logs}
        │
        └─▶ launcher/windows/main.go     → detecta distro, arranca Control Center
        │
        ▼
[2] Control Center (:9092)         ← wsl.exe -d <distro> -- bash -lc "<comando>"
        │
        ▼
[3] Servicios WSL2                 ← nginx :8080, apache :8081, node :8082,
                                     flask :8083, postgres :5432, mini :8090
```

---

📖 Ver también: [README.md](README.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [RUNBOOK.md](RUNBOOK.md)
