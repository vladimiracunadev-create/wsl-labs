# 🛠️ Developing

Guía para **extender y mantener** `wsl-labs` sin romper la coherencia del
proyecto ni el flujo real de Windows ↔ contenedores `wslc`.

> [!NOTE]
> Para operar el día a día (construir, levantar, bajar, logs) usa el
> [RUNBOOK.md](RUNBOOK.md). Este documento es para **desarrollar** el repo:
> añadir casos de contenedor, tocar el panel y validar antes de subir.
<!-- -->

> [!TIP]
> `wsl-labs` es un **WSL Container Center**: levanta contenedores reales con
> `wslc` (motor nativo de WSL 2.9+, tipo Docker). Las guías de fundamentos de WSL
> (`docs/00-05`, historia, cheatsheets) quedan como **documentación de contexto**;
> el foco operativo son los contenedores.

---

## 🧭 Principios

- Cada caso empaqueta un contenedor (o stack de contenedores) reproducible con
  `wslc`, portado de `docker-labs` o nuevo.
- La documentación debe coincidir con lo que el código **realmente entrega**.
- El **launcher `.exe`** y el instalador son una capa aditiva de Windows: no
  reemplazan a `wslc` ni al panel Node.js.
- Si cambias puertos, imágenes o contenedores de un caso, **hazlo en
  `containers/containers.config.json`** y refléjalo en el README del caso. No lo
  dupliques.

---

## 🗂️ Estructura del repo

| Pieza | Rol |
| --- | --- |
| 📇 `containers/containers.config.json` | **Fuente única de verdad** del catálogo (casos, puertos, imágenes, contenedores, redes) |
| 🐳 `containers/NN-nombre/` | Un directorio por caso: `Dockerfile` (si es imagen propia), código y `README.md` |
| 🧭 `dashboard-server/` | Panel Node.js (`:9092`), servidor HTTP con `http` nativo |
| `dashboard-server/server.js` | Backend: overview + acciones `wslc` |
| `dashboard-server/verify-localhost.js` | Verificador del catálogo y disponibilidad local |
| `index.html` · `dashboard.css` · `dashboard.js` | UI web del panel |
| 🪟 `launcher/windows/main.go` | Launcher Go (solo stdlib, sin dependencias) |
| 📦 `installer/wsl-labs.iss` | Script de **Inno Setup** que empaqueta el launcher |
| ⚙️ `.github/workflows/` | CI/CD: docs, dashboard, build-windows |
| `docs/` | Guías de contexto de WSL (`00-05`, historia) + `wslc-contenedores.md` |
| `version.txt` | Fuente única de la versión del proyecto |

---

## 🐳 Cómo añadir un caso de contenedor

### 1 · Naming y estructura

Formato `NN-nombre-kebab`, número de dos dígitos:

```text
containers/13-mi-caso/
├── Dockerfile   # solo si construyes una imagen propia (FROM …)
├── server.js    # (opcional) código de la app
└── README.md
```

> [!NOTE]
> El `Dockerfile` **solo hace falta si la imagen es propia**. Si el caso usa una
> imagen oficial tal cual (p. ej. `prom/prometheus`, `jenkins/jenkins:lts`), el
> array `build` va vacío y solo defines `containers`.

### 2 · Registro en `containers/containers.config.json`

Añade una entrada al array `cases`:

```json
{
  "id": "13",
  "name": "mi-caso",
  "title": "Mi caso",
  "description": "Descripción corta (imagen base, qué expone).",
  "category": "starter",
  "port": 8115,
  "url": "http://localhost:8115",
  "healthProtocol": "http",
  "build": [{ "image": "wsl-labs/mi-caso:latest", "context": "containers/13-mi-caso" }],
  "containers": [{ "name": "wslc-mi-caso", "image": "wsl-labs/mi-caso:latest", "ports": ["8115:3000"] }]
}
```

| Campo | Uso |
| --- | --- |
| `category` | `starter`, `platform` o `infra` |
| `port` / `url` | Puerto host publicado y URL de verificación |
| `healthProtocol` | `http` (sonda HTTP en el puerto) |
| `network` | Nombre de red `wslc` cuando hay varios contenedores comunicándose |
| `build` | Imágenes propias (`image` + `context`); vacío si usas imagen oficial |
| `containers` | Contenedores a levantar (`name`, `image`, `ports`, `env` opcional) |

> [!IMPORTANT]
> Para multi-contenedor, referencia el otro contenedor por su `name` (DNS interno
> de la red `wslc`) en las variables `env`, p. ej. `PG_HOST=wslc-postgres`. El
> panel crea la red declarada en `network` y conecta los contenedores.

### 3 · Contenedor único vs. stack

| Forma | Cuándo | En el catálogo |
| --- | --- | --- |
| 🧩 **Contenedor único** | Una sola imagen expone un puerto | Un elemento en `containers`, sin `network` |
| 🕸️ **Stack multi-contenedor** | App + dependencia (Redis, Postgres, Mongo…) | Varios `containers` + `network`, comunicados por nombre |

### 4 · README del caso

Sigue la plantilla de los casos existentes (mira
[`containers/01-node-api/README.md`](containers/01-node-api/README.md)): datos del
caso en tabla, comandos `wslc build`/`run`, verificación con `curl`, uso desde el
panel, bajar, y un diagrama Mermaid opcional.

---

## 🖥️ Cómo tocar el panel

El panel es un servidor Node.js con el módulo `http` **nativo** (sin dependencias
npm). Escucha **solo en `127.0.0.1:9092`** y ejecuta `wslc.exe` en **Windows**
(lo localiza en `C:\Program Files\WSL\wslc.exe`, o vía `WSL_LABS_WSLC`).

| Endpoint | Método | Uso |
| --- | --- | --- |
| `/api/wslc/overview` | GET | Estado global de todos los casos |
| `/api/wslc/build` | POST | Construye la(s) imagen(es) del caso (`{ "id": "NN" }`) |
| `/api/wslc/up` | POST | Crea red (si aplica) y levanta los contenedores del caso |
| `/api/wslc/down` | POST | Detiene y elimina los contenedores del caso |
| `/api/wslc/logs` | POST | Últimas líneas de log de los contenedores del caso |

> [!IMPORTANT]
> El panel corre `wslc` en Windows y **no** necesita `wsl -u root`, contraseñas
> ni sudo. **No lo expongas a la red**: mantenlo en `127.0.0.1`. Si tocas el
> binding o la seguridad, revisa [SECURITY.md](SECURITY.md).

Reglas al modificar el servidor:

- No introduzcas dependencias npm: se mantiene "solo stdlib".
- Respeta el rate-limit nativo y el token opcional `WSL_LABS_TOKEN`.
- Prueba health en **IPv4 e IPv6** (como `curl localhost`).
- Localiza el motor por `WSL_LABS_WSLC` → `C:\Program Files\WSL\wslc.exe` → PATH.

---

## ✅ Validación local

Antes de abrir un PR, ejecuta lo que aplique a tu cambio:

```powershell
# 1. Catálogo + endpoint overview (equivale al workflow dashboard)
node dashboard-server/verify-localhost.js
#   o
make test-dashboard

# 2. Construye y levanta el caso, y comprueba localhost
Invoke-RestMethod -Method Post -Headers @{ 'Content-Type'='application/json' } `
  -Body '{ "id": "13" }' http://localhost:9092/api/wslc/build
Invoke-RestMethod -Method Post -Headers @{ 'Content-Type'='application/json' } `
  -Body '{ "id": "13" }' http://localhost:9092/api/wslc/up
Invoke-WebRequest http://localhost:8115 -UseBasicParsing
```

Los mismos checks que corre CI (replícalos en local cuando puedas):

| Workflow | Qué valida | Herramienta |
| --- | --- | --- |
| `docs.yml` | Markdown de todo el repo | markdownlint-cli2 |
| `dashboard.yml` | Catálogo y panel | `verify-localhost.js` (Node) |
| `build-windows.yml` | Launcher + instalador Inno Setup | Solo en tag `vX.Y.Z` |

> [!TIP]
> Para el launcher Go, compila local con
> `cd launcher\windows; go build -ldflags "-X main.launcherVersion=0.1.0" -o wsl-labs-launcher.exe .`

---

## 🌿 Flujo git sugerido

1. 🌿 Crea una rama descriptiva.
2. ✏️ Haz cambios pequeños y verificables (carpeta + Dockerfile + catálogo + README).
3. 📖 Actualiza docs si cambias flujo operativo.
4. ✅ Corre las validaciones que apliquen.
5. 🚀 Abre el PR con contexto claro.

```text
feat: add mi-caso container (13) to catalog
fix: harden localhost dashboard for IPv6 health check
docs: align wslc setup with pre-release update
```

---

📖 Ver también: [RUNBOOK.md](RUNBOOK.md) · [RELEASE.md](RELEASE.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/MAINTAINERS.md](docs/MAINTAINERS.md) · [FILE_ARCHITECTURE.md](FILE_ARCHITECTURE.md)
