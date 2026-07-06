# 🤝 CONTRIBUTING — WSL Container Center

> Gracias por tu interés en contribuir. Este documento resume cómo añadir un
> **caso de contenedor**, tocar el panel o la documentación sin romper la
> coherencia del proyecto. Consulta el [RUNBOOK.md](RUNBOOK.md) para los comandos
> operativos.
<!-- -->

> [!NOTE]
> `wsl-labs` levanta y controla **contenedores** con `wslc`, el motor de
> contenedores nativo de WSL 2.9+ (tipo Docker). Las guías de fundamentos de WSL
> (`docs/00-05`, historia, cheatsheets) siguen presentes como **documentación de
> contexto**, pero el foco operativo del repo son los contenedores.

---

## 🗂️ Tipos de contribución

| Tipo | Descripción | Archivos clave |
| --- | --- | --- |
| 🐳 Nuevo caso | Un contenedor (o stack) portado o nuevo | `containers/NN-nombre/`, `containers/containers.config.json` |
| 🖥️ Fix del panel | Cambios en la API o UI web | `dashboard-server/`, `dashboard.js`, `index.html` |
| 🚀 Fix del launcher | Cambios en la app Go | `launcher/windows/main.go` |
| 📖 Mejora de docs | README, runbooks, guías de contexto WSL | `docs/`, raíz |
| ⚙️ CI/CD | Cambios en workflows y verificadores | `.github/workflows/` |

---

## 📇 Regla principal: un solo catálogo fuente

La fuente única de verdad es **`containers/containers.config.json`**.

El panel y el launcher **leen ese archivo directamente**: puertos, imágenes,
contenedores, redes y descripciones salen de ahí. No dupliques esta información
en otros JSON ni la hardcodees en la UI.

> [!IMPORTANT]
> Si cambias un puerto, una imagen o un nombre de contenedor, hazlo en
> `containers/containers.config.json` y déjalo reflejado en el `README.md` del
> caso. No hardcodees puertos en el dashboard.

---

## 🐳 Añadir un caso de contenedor

### 1 · Naming y estructura

Usa el formato `NN-nombre-kebab`:

```text
containers/13-mi-caso/
├── Dockerfile      # solo si es una imagen propia (FROM …)
├── server.js       # (opcional) código de la app
└── README.md
```

- `NN` — número de dos dígitos
- `nombre-kebab` — descriptivo, en minúsculas y guiones
- El `Dockerfile` **solo hace falta si construyes una imagen propia**. Si el caso
  usa una imagen oficial tal cual (p. ej. `rabbitmq:3-management`), el array
  `build` va vacío.

### 2 · Registro en `containers/containers.config.json`

Añade una entrada al array `cases`. Ejemplo de **imagen propia** (contenedor
único):

```json
{
  "id": "13",
  "name": "mi-caso",
  "title": "Mi caso",
  "description": "Descripción corta del caso (imagen base, qué expone).",
  "category": "starter",
  "port": 8115,
  "url": "http://localhost:8115",
  "healthProtocol": "http",
  "build": [{ "image": "wsl-labs/mi-caso:latest", "context": "containers/13-mi-caso" }],
  "containers": [{ "name": "wslc-mi-caso", "image": "wsl-labs/mi-caso:latest", "ports": ["8115:3000"] }]
}
```

Ejemplo de **multi-contenedor con red** (imagen oficial + app propia):

```json
{
  "id": "14",
  "name": "app-con-cache",
  "title": "App + Redis",
  "description": "App Node que consulta Redis por una red wslc.",
  "category": "platform",
  "port": 8116,
  "url": "http://localhost:8116",
  "healthProtocol": "http",
  "network": "wslc-cache-net",
  "build": [{ "image": "wsl-labs/cache-app:latest", "context": "containers/14-app-con-cache" }],
  "containers": [
    { "name": "wslc-cache", "image": "redis:7-alpine", "ports": [] },
    { "name": "wslc-cache-app", "image": "wsl-labs/cache-app:latest", "ports": ["8116:3000"], "env": ["REDIS_HOST=wslc-cache"] }
  ]
}
```

| Campo | Uso |
| --- | --- |
| `category` | `starter`, `platform` o `infra` (agrupación en el panel) |
| `port` / `url` | Puerto host publicado y URL de verificación |
| `healthProtocol` | `http` (sonda HTTP en el puerto) |
| `network` | Nombre de la red `wslc` si hay varios contenedores que se comunican |
| `build` | Imágenes propias a construir (`image` + `context`); vacío si usas imagen oficial |
| `containers` | Contenedores a levantar (`name`, `image`, `ports`, `env` opcional) |

> [!TIP]
> Para varios contenedores que se hablan entre sí, define `network` y referencia
> el otro contenedor por su `name` en las variables `env` (p. ej.
> `REDIS_HOST=wslc-cache`). El panel crea la red y conecta los contenedores.

### 3 · README del caso (plantilla)

Cada caso sigue la misma plantilla homogénea:

```markdown
# NN · Título del caso 🐳

Descripción de una línea (imagen base, qué expone, motor wslc).

## 📋 Datos del caso

| Categoría | Valor |
|---|---|
| Categoría | `starter` |
| Imagen | `wsl-labs/mi-caso:latest` (base `node:20-alpine`) |
| Puerto host | `8115` → contenedor `3000` |
| Red | — (contenedor único) |
| Health | `GET /health` (HTTP 200) |

## 🚀 Construir y levantar

​```bash
wslc build -t wsl-labs/mi-caso:latest containers/13-mi-caso
wslc run -d --name wslc-mi-caso -p 8115:3000 wsl-labs/mi-caso:latest
​```

## ✅ Verificar

​```bash
curl http://localhost:8115
​```

## 🧭 Desde el panel

En http://localhost:9092 busca la tarjeta del caso y usa **Construir**,
**Levantar**, **Bajar** y **Logs**.

## 🛑 Bajar

​```bash
wslc stop wslc-mi-caso
wslc rm wslc-mi-caso
​```
```

### 4 · Validación

```powershell
# desde la raíz del repo
node dashboard-server/verify-localhost.js
# o
make test-dashboard
```

Luego construye/levanta el caso desde el panel y comprueba `localhost`:

```powershell
Invoke-RestMethod -Method Post -Headers @{ 'Content-Type'='application/json' } `
  -Body '{ "id": "13" }' http://localhost:9092/api/wslc/build
Invoke-RestMethod -Method Post -Headers @{ 'Content-Type'='application/json' } `
  -Body '{ "id": "13" }' http://localhost:9092/api/wslc/up
Invoke-WebRequest http://localhost:8115 -UseBasicParsing
```

---

## 🚀 Launcher Windows (Go)

El launcher está en `launcher/windows/main.go` y solo usa la biblioteca estándar
de Go (sin dependencias externas).

### Requisitos de desarrollo

- **Go 1.21+**
- WSL 2.9+ con `wslc` disponible (`wsl --update --pre-release`)
- Node.js 18+ en el PATH de Windows

### Compilar

```powershell
cd launcher\windows
go build -ldflags "-X main.launcherVersion=0.1.0" -o wsl-labs-launcher.exe .
```

El instalador se empaqueta con **Inno Setup** (`installer/wsl-labs.iss`) al
pushear un tag `vX.Y.Z`.

---

## 📝 Convenciones

- Nombres de caso en formato `NN-kebab-case`.
- Puertos **fijos y previsibles** (ver [RUNBOOK.md](RUNBOOK.md)); parten de `8100`.
- Cada caso documenta su URL/puerto en su `README.md`.
- No hardcodees puertos, imágenes ni nombres de contenedor fuera de
  `containers/containers.config.json`.
- Español en toda la documentación, con emoji por sección y callouts
  (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`).

---

## 🌿 Flujo git sugerido

1. 🌿 Crea una rama descriptiva.
2. ✏️ Haz cambios pequeños y verificables (carpeta + Dockerfile + catálogo + README).
3. 📖 Actualiza docs si cambias flujo operativo.
4. ✅ Ejecuta las validaciones que apliquen.
5. 🚀 Abre el PR con contexto claro.

### Ejemplos de commits

```text
feat: add mi-caso container (13) to catalog
fix: harden localhost dashboard static path handling
docs: align wslc setup with pre-release update
test: add verify-localhost edge case coverage
```

---

📖 Ver también: [RUNBOOK.md](RUNBOOK.md) · [FILE_ARCHITECTURE.md](FILE_ARCHITECTURE.md) · [DEVELOPING.md](DEVELOPING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
