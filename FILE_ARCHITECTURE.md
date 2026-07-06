# 🏗️ FILE_ARCHITECTURE — WSL Container Center

> Árbol comentado del repositorio y guía de qué editar / qué no.
> Para el contexto de cada componente, consulta el [README.md](README.md).

---

## 🌳 Árbol de archivos

```text
wsl-labs/
│
├── containers/                         # 🐳 CASOS DE CONTENEDOR (wslc)
│   ├── containers.config.json          # 📇 CATÁLOGO — fuente única de verdad
│   ├── 01-node-api/                    # 🟢 API Node.js  → :8101 (imagen propia)
│   ├── 02-php-lamp/                    # 🐬 LAMP PHP+MariaDB → :8107 (red wslc)
│   ├── 03-python-api/                  # 🐍 API Flask   → :8102 (imagen propia)
│   ├── 04-redis-cache/                 # 🔴 App + Redis → :8105 (red wslc)
│   ├── 05-postgres-api/                # 🐘 API + PostgreSQL → :8106 (red wslc)
│   ├── 06-nginx-web/                   # 🌐 Nginx web   → :8104 (imagen propia)
│   ├── 07-rabbitmq/                    # 🐇 RabbitMQ    → :8109 (imagen oficial)
│   ├── 08-prometheus-grafana/          # 📊 Prometheus+Grafana → :8110 (red wslc)
│   ├── 09-multi-service/               # 🍃 Backend + Mongo → :8112 (red wslc)
│   ├── 10-go-api/                      # 🐹 API Go      → :8103 (imagen propia)
│   ├── 11-elasticsearch/               # 🔎 Elasticsearch → :8113 (imagen oficial)
│   └── 12-jenkins/                     # 🔧 Jenkins CI  → :8114 (imagen oficial)
│       └── (cada caso: Dockerfile si es imagen propia, código, README.md)
│
├── dashboard-server/
│   ├── server.js                       # 🌐 Panel — API wslc + estáticos (Node http nativo)
│   ├── verify-localhost.js             # 🧪 Smoke test del catálogo y del endpoint overview
│   └── package.json                    # metadatos (sin dependencias runtime)
│
├── launcher/
│   └── windows/
│       ├── main.go                     # 🚀 Launcher Go (.exe) — arranca el panel y abre el browser
│       └── go.mod                      # módulo Go (solo stdlib)
│
├── installer/
│   └── wsl-labs.iss                    # 📦 Script Inno Setup — empaqueta el launcher en .exe
│
├── docs/                               # 📚 Contexto de WSL + guía wslc
│   ├── 00-que-es-wsl.md                # Fundamentos de WSL (contexto)
│   ├── 01-instalacion-wsl.md           # Instalación (contexto)
│   ├── 02-comandos-basicos.md          # Comandos (contexto)
│   ├── 03-wsl-vs-docker-vs-vm.md       # Comparativa (contexto)
│   ├── 04-buenas-practicas.md          # Buenas prácticas (contexto)
│   ├── 05-roadmap.md                   # Notas de evolución (contexto)
│   ├── wsl-historia-y-referencia.md    # Historia y referencia de WSL (contexto)
│   ├── wslc-contenedores.md            # 🐳 Guía del motor wslc
│   └── MAINTAINERS.md                  # Guía de mantenedores
│
├── cheatsheets/                        # comandos-wsl, comandos-linux, systemd, redes… (contexto)
├── assets/branding/                    # identidad visual de la línea
├── .github/                            # workflows CI + ISSUE_TEMPLATE + PR template
│
├── index.html                          # 🌐 UI del panel
├── dashboard.css                       # 🎨 Estilos del panel
├── dashboard.js                        # ⚡ Lógica del panel
│
├── Makefile                            # Targets: serve, test-dashboard, build-<caso>, ps, images, prune
├── version.txt                         # Versión canónica del proyecto
├── README.md                           # Punto de entrada del repositorio
└── LICENSE                             # Apache-2.0
```

> [!NOTE]
> `docs/00-05`, `wsl-historia-y-referencia.md` y `cheatsheets/` son
> **documentación de contexto** sobre WSL. El foco operativo del repo son los
> contenedores en `containers/`.

---

## 🔑 Qué editar / qué no

| Archivo | Rol | ¿Editar? |
| --- | --- | :---: |
| `containers/containers.config.json` | Fuente de verdad del catálogo (casos, puertos, imágenes, contenedores, redes) | ✅ **Editar aquí** |
| `containers/NN-*/Dockerfile` | Imagen propia de un caso | ✅ (si es imagen propia) |
| `containers/NN-*/README.md` | Guía de cada caso | ✅ |
| `dashboard-server/server.js` | Backend que invoca `wslc.exe` | ✅ |
| `dashboard-server/verify-localhost.js` | Valida el catálogo y el panel | ✅ |
| `launcher/windows/main.go` | Launcher Go | ✅ |
| `installer/wsl-labs.iss` | Script Inno Setup del instalador | ✅ |
| `index.html` · `dashboard.css` · `dashboard.js` | UI del panel | ✅ |
| `version.txt` | Versión canónica | ✅ (al publicar release) |
| `wsl-labs-launcher.exe` | Binario compilado del launcher | ❌ Se genera con `go build` |
| Puertos/imágenes hardcodeados en la UI | — | ❌ No los dupliques; salen del catálogo |

> [!IMPORTANT]
> `containers/containers.config.json` es la **única fuente de verdad**. El panel y
> el launcher lo leen directamente. Si cambias un puerto, imagen o contenedor,
> hazlo ahí y refléjalo en el README del caso afectado.

---

## 🔄 Flujo de datos del catálogo

```text
[1] containers/containers.config.json   ← fuente de verdad (casos, puertos, imágenes, redes)
        │
        ├─▶ dashboard-server/server.js   → GET /api/wslc/overview
        │                                  POST /api/wslc/{build|up|down|logs}
        │
        └─▶ launcher/windows/main.go     → arranca el panel, hace polling, abre el browser
        │
        ▼
[2] Panel (:9092)                        ← invoca C:\Program Files\WSL\wslc.exe (en Windows)
        │
        ▼
[3] Contenedores wslc                    ← node-api :8101, python-api :8102, go-api :8103,
                                           nginx :8104, redis-app :8105, pg-app :8106,
                                           php-lamp :8107, rabbitmq :8109, grafana :8110,
                                           multi :8112, elasticsearch :8113, jenkins :8114
```

---

📖 Ver también: [README.md](README.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [DEVELOPING.md](DEVELOPING.md) · [RUNBOOK.md](RUNBOOK.md)
