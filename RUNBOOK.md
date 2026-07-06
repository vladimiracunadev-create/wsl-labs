# 🛠️ RUNBOOK — WSL Control Center v1

> Guía operativa del día a día para levantar, monitorear y detener servicios
> Linux sobre WSL2 desde Windows.
> Para el setup inicial, consulta [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 🩺 1 · Validar WSL antes de operar

```powershell
wsl --status
wsl -l -v
```

Debes ver:

- ✅ WSL en modo **2** por defecto
- ✅ Tu distro (`Ubuntu`) con `VERSION 2`
- ✅ `node --version` responde en Windows (≥ 18)

---

## 🖥️ 2 · Levantar el Control Center

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

## ▶️ 3 · Levantar / bajar servicios

Cada servicio se identifica por su `id` del catálogo. Desde la API (modo dev,
sin token):

```powershell
$h = @{ 'Content-Type' = 'application/json' }

# Levantar nginx (lab 05)
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "05" }' http://localhost:9092/api/wsl/start

# Detener nginx (lab 05)
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "05" }' http://localhost:9092/api/wsl/stop

# Ver logs de nginx (lab 05)
Invoke-RestMethod -Method Post -Headers $h -Body '{ "id": "05" }' http://localhost:9092/api/wsl/logs
```

También puedes hacerlo con un clic desde la UI del Control Center.

> [!TIP]
> Si activaste `WSL_LABS_TOKEN`, añade el header `Authorization: Bearer <token>`
> a cada llamada `/api`.

---

## ✅ 4 · Verificar salud

```powershell
# Estado global de todos los labs
Invoke-RestMethod http://localhost:9092/api/overview

# Salud de un servicio concreto (lab 05)
Invoke-RestMethod http://localhost:9092/api/health/05

# Respuesta real del servicio
Invoke-WebRequest http://localhost:8080 -UseBasicParsing
```

Estados que devuelve el Control Center:

| Estado | Emoji | Significado |
|---|:---:|---|
| `healthy` | ✅ | Responde correctamente en su puerto |
| `degraded` | ⚠️ | Puerto abierto pero HTTP da error |
| `stopped` | ⏹ | Puerto cerrado / servicio abajo |
| `n/a` | 📚 | Lab de aprendizaje (sin servicio) |

---

## 📡 5 · Puertos y servicios

| Servicio | Lab | Puerto | URL | Health |
|---|:---:|---:|---|---|
| 🧭 Control Center | — | 9092 | <http://localhost:9092> | — |
| 🌐 nginx | 05 | 8080 | <http://localhost:8080> | `http` |
| 🐘 apache + php | 06 | 8081 | <http://localhost:8081> | `http` |
| 🟢 node API | 07 | 8082 | <http://localhost:8082> | `http` |
| 🐍 flask | 08 | 8083 | <http://localhost:8083> | `http` |
| 🗄️ postgresql | 09 | 5432 | `postgres://localhost:5432` | `tcp` |
| 🧱 mini-servidor | 11 | 8090 | <http://localhost:8090> | `http` |

---

## ⚡ 6 · Comandos wsl.exe rápidos

### Estado y distros

```powershell
wsl -l -v                 # distros y su versión WSL
wsl --status              # estado general de WSL
wsl -l -q                 # solo nombres (lo que usa el launcher)
```

### Operar servicios dentro de la distro

```powershell
# Estado de un servicio
wsl -d Ubuntu -- bash -lc "service nginx status"

# Arrancar / detener manualmente
wsl -d Ubuntu -- sudo service nginx start
wsl -d Ubuntu -- sudo service nginx stop

# Ver puertos escuchando dentro de WSL
wsl -d Ubuntu -- bash -lc "ss -tulpn"
```

### Ciclo de vida de la distro

```powershell
wsl --shutdown            # apaga todas las distros (reset limpio)
wsl -d Ubuntu             # abre una shell en la distro
```

> [!WARNING]
> `wsl --shutdown` detiene **todos** los servicios en marcha. Úsalo cuando
> quieras un arranque limpio, no en medio de una demo.

---

## 🚀 7 · Uso del launcher

1. Ejecuta `wsl-labs-launcher.exe` (doble clic o desde PowerShell)
2. El launcher **verifica WSL2** (`wsl.exe --status`) y detecta la distro
3. **Localiza la raíz del repo** (directorio del `.exe` o variable `WSL_LABS_HOME`)
4. **Arranca el Control Center** (`node dashboard-server/server.js`) en segundo plano
5. Hace **polling a `/api/overview`** hasta 90 s
6. **Abre el navegador** en `http://localhost:9092`

> [!NOTE]
> Puedes cerrar la ventana del launcher: el Control Center sigue corriendo en
> segundo plano.

---

## 🧪 8 · Verificación automatizada

```powershell
# desde la raíz del repo
node dashboard-server/verify-localhost.js
# o
make test-dashboard
```

---

## 🏗️ Criterio operativo

| Capa | Responsabilidad |
|---|---|
| 🪟 Windows | Capa de UX (Control Center, launcher) |
| 🐧 WSL2 | Capa técnica (servicios Linux, systemd/service, sudo) |
| 🌐 localhost | Superficie de servicios expuestos |
| 📇 `labs.config.json` | Fuente única de verdad del catálogo |

---

📖 Ver también: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [cheatsheets/comandos-wsl.md](cheatsheets/comandos-wsl.md)
