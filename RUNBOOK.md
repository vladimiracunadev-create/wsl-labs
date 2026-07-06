# 🛠️ RUNBOOK — WSL Container Center

> Guía operativa del día a día para construir, levantar, monitorear y bajar
> **contenedores** con `wslc` desde Windows.
> Para el setup inicial, consulta [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 🩺 1 · Validar el motor antes de operar

```powershell
wsl --version
& "C:\Program Files\WSL\wslc.exe" version
node --version
```

Debes ver:

- ✅ WSL en versión **2.9+** (si no, `wsl --update --pre-release`)
- ✅ `wslc version` responde (motor de contenedores disponible)
- ✅ `node --version` ≥ 18 en Windows

---

## 🖥️ 2 · Levantar el panel

```powershell
cd C:\dev\wsl-labs
node dashboard-server/server.js
# o:
make serve
```

Abre → **<http://localhost:9092>**

> [!NOTE]
> El servidor escucha **solo en `127.0.0.1`**. No se expone a la red por diseño
> (ver [SECURITY.md](SECURITY.md)).

---

## ▶️ 3 · Construir, levantar y bajar casos

El flujo recomendado es **100 % desde el panel**, sin contraseñas y sin terminal.
El panel ejecuta `wslc.exe` en Windows (Windows ya autenticó al usuario), así que
**nunca pide contraseña**.

```text
1. Abre  →  http://localhost:9092
2. Pulsa 🔨 Construir  → construye la imagen del caso (solo si tiene Dockerfile)
3. Pulsa ▶ Levantar    → crea la red (si aplica) y arranca los contenedores
4. Pulsa 📄 Logs / 🛑 Bajar según lo necesites
```

> [!NOTE]
> Los casos que usan imágenes oficiales (RabbitMQ, Prometheus/Grafana,
> Elasticsearch, Jenkins) **no necesitan Construir**: pulsa directamente
> **Levantar**.

### Por API (modo dev, sin token)

Cada caso se identifica por su `id` del catálogo:

```powershell
$h = @{ 'Content-Type' = 'application/json' }

# Construir la imagen del caso 01
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "01" }' http://localhost:9092/api/wslc/build

# Levantar el caso 01
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "01" }' http://localhost:9092/api/wslc/up

# Ver logs del caso 01
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "01" }' http://localhost:9092/api/wslc/logs

# Bajar el caso 01
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "01" }' http://localhost:9092/api/wslc/down
```

> [!TIP]
> Si activaste `WSL_LABS_TOKEN`, añade el header `Authorization: Bearer <token>`
> a cada llamada `/api`.

### Por terminal (`make build-*` / `wslc` directo)

```powershell
make build-node    # construye wsl-labs/node-api:latest
& "C:\Program Files\WSL\wslc.exe" run -d --name wslc-node-api -p 8101:3000 wsl-labs/node-api:latest
```

---

## ✅ 4 · Verificar salud

```powershell
# Estado global de todos los casos
Invoke-RestMethod http://localhost:9092/api/wslc/overview

# Respuesta real de un caso (p. ej. node-api en :8101)
Invoke-WebRequest http://localhost:8101 -UseBasicParsing
```

---

## 📡 5 · Casos y puertos

| Caso | id | Categoría | Puerto host | URL |
| --- | :---: | --- | ---: | --- |
| 🧭 Panel | — | — | 9092 | <http://localhost:9092> |
| 🟢 API Node.js | 01 | starter | 8101 | <http://localhost:8101> |
| 🐍 API Python (Flask) | 03 | starter | 8102 | <http://localhost:8102> |
| 🐹 API Go | 10 | starter | 8103 | <http://localhost:8103> |
| 🌐 Nginx web | 06 | starter | 8104 | <http://localhost:8104> |
| 🔴 Cache Redis + app | 04 | platform | 8105 | <http://localhost:8105> |
| 🐘 API + PostgreSQL | 05 | platform | 8106 | <http://localhost:8106> |
| 🐬 LAMP (PHP + MariaDB) | 02 | platform | 8107 | <http://localhost:8107> |
| 🐇 RabbitMQ | 07 | infra | 8109 | <http://localhost:8109> |
| 📊 Prometheus + Grafana | 08 | infra | 8110 | <http://localhost:8110> |
| 🍃 Multi-servicio (Mongo) | 09 | platform | 8112 | <http://localhost:8112> |
| 🔎 Elasticsearch | 11 | infra | 8113 | <http://localhost:8113> |
| 🔧 Jenkins CI | 12 | infra | 8114 | <http://localhost:8114> |

> [!NOTE]
> Los casos multi-contenedor (`04`, `05`, `02`, `09`, `08`) crean una **red
> `wslc`** propia y conectan los contenedores por nombre.

---

## ⚡ 6 · Comandos `wslc` rápidos

```powershell
$wslc = "C:\Program Files\WSL\wslc.exe"

# Contenedores e imágenes
& $wslc list                 # contenedores (≈ docker ps)
& $wslc images               # imágenes locales

# Logs y ciclo de vida
& $wslc logs wslc-node-api
& $wslc stop wslc-node-api
& $wslc rm wslc-node-api

# Redes y volúmenes
& $wslc network ls
& $wslc volume ls
```

Atajos con `make`:

```powershell
make ps        # wslc list
make images    # wslc images
make prune     # elimina contenedores parados + imágenes colgadas
```

---

## 🧹 7 · Limpieza

```powershell
$wslc = "C:\Program Files\WSL\wslc.exe"

# Bajar un caso concreto (desde el panel: botón 🛑 Bajar)
& $wslc stop wslc-node-api; & $wslc rm wslc-node-api

# Limpieza general
make prune                   # contenedores parados + imágenes colgadas
& $wslc network prune        # redes wslc sin usar
```

> [!WARNING]
> `make prune` elimina contenedores parados e imágenes colgadas. Si tienes un
> caso pesado ya construido (Elasticsearch, Jenkins) y quieres conservar su
> imagen, no la borres a mano.

---

## 🚀 8 · Uso del launcher

1. Ejecuta `wsl-labs-launcher.exe` (doble clic o desde PowerShell).
2. El launcher **verifica WSL** y localiza `wslc`.
3. **Localiza la raíz del repo** (directorio del `.exe` o `WSL_LABS_HOME`).
4. **Arranca el panel** (`node dashboard-server/server.js`) en segundo plano.
5. Hace **polling a `/api/wslc/overview`**.
6. **Abre el navegador** en `http://localhost:9092`.

> [!NOTE]
> Puedes cerrar la ventana del launcher: el panel sigue corriendo en segundo
> plano.

---

## 🧪 9 · Verificación automatizada

```powershell
# desde la raíz del repo
node dashboard-server/verify-localhost.js
# o
make test-dashboard
```

---

## 🏗️ Criterio operativo

| Capa | Responsabilidad |
| --- | --- |
| 🪟 Windows | Capa de UX (panel, launcher) y ejecución de `wslc.exe` |
| 🐳 `wslc` | Motor de contenedores nativo de WSL (build/run/network) |
| 🌐 localhost | Superficie de puertos host publicados por los contenedores |
| 📇 `containers/containers.config.json` | Fuente única de verdad del catálogo |

---

📖 Ver también: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/wslc-contenedores.md](docs/wslc-contenedores.md)
