# 🛠️ Developing

Guía para **extender y mantener** `wsl-labs` sin romper la coherencia del
proyecto ni el flujo real de Windows ↔ WSL2.

> [!NOTE]
> Para operar el día a día (levantar servicios, health, logs) usa el
> [RUNBOOK.md](RUNBOOK.md). Este documento es para **desarrollar** el repo:
> añadir labs, tocar el Control Center y validar antes de subir.

---

## 🧭 Principios

- Cada lab resuelve un concepto concreto de **WSL2** (instalación, systemd,
  servicios en `localhost`, backup…).
- La documentación debe coincidir con lo que el código **realmente entrega**.
- El **launcher `.exe`** y el instalador son una capa aditiva de Windows: no
  reemplazan a `wsl.exe` ni al Control Center Node.js.
- Si cambias puertos, comandos o estado de un lab, **hazlo en
  `labs.config.json`** y refléjalo en el README del lab. No lo dupliques.

---

## 🗂️ Estructura del repo

| Pieza | Rol |
| --- | --- |
| 📇 `labs.config.json` | **Fuente única de verdad** del catálogo (puertos, comandos, health, estado) |
| 🧭 `dashboard-server/` | Control Center Node.js (`:9092`), servidor HTTP con `http` nativo |
| `dashboard-server/verify-localhost.js` | Verificador del catálogo y disponibilidad local |
| `index.html` · `dashboard.css` · `dashboard.js` | UI web del Control Center |
| 🐧 `labs/NN-nombre/` | Un directorio por lab, con su `README.md` |
| 🐚 `scripts/install-*.sh` | Instaladores idempotentes de cada servicio |
| 🪟 `launcher/windows/main.go` | Launcher Go (solo stdlib, sin dependencias) |
| 📦 `scripts/windows/*.ps1` | Build del launcher, del instalador y pipeline de release |
| ⚙️ `.github/workflows/` | CI/CD: docs, scripts, dashboard, build-windows |
| `version.txt` | Fuente única de la versión del proyecto |

---

## 🧪 Cómo añadir un lab

Hay dos tipos de lab. Elige según lo que aporte:

| Tipo | Cuándo | Necesita |
| --- | --- | --- |
| ⚙️ **service** | Expone un servicio en un puerto de `localhost` | `install-*.sh` + comandos start/stop/logs + health |
| 📚 **learning** | Es una guía conceptual, sin servicio | Solo `README.md` |

### 1 · Naming y estructura

Formato `NN-nombre-kebab`, número secuencial de dos dígitos:

```text
labs/13-servidor-ssh/
└── README.md
```

### 2 · Registro en `labs.config.json`

Añade una entrada al array `labs`. Para un **lab de servicio**:

```json
{
  "id": "13",
  "name": "servidor-ssh",
  "path": "labs/13-servidor-ssh",
  "type": "service",
  "status": "ready",
  "description": "Servidor SSH sirviendo en localhost:2222.",
  "url": "ssh://localhost:2222",
  "port": 2222,
  "requires": "sshd",
  "installHint": "wsl bash scripts/install-ssh.sh",
  "installCommand": "bash \"$WSL_LABS_ROOT/scripts/install-ssh.sh\"",
  "startCommand": "sudo service ssh start",
  "stopCommand": "sudo service ssh stop",
  "logsCommand": "sudo tail -n 50 /var/log/auth.log 2>/dev/null || true",
  "healthProtocol": "tcp"
}
```

Para un **lab de aprendizaje** (sin servicio):

```json
{
  "id": "14",
  "name": "cron-y-tareas",
  "path": "labs/14-cron-y-tareas",
  "type": "learning",
  "status": "ready",
  "description": "Programar tareas con cron dentro de WSL.",
  "healthProtocol": null
}
```

| Campo | Uso |
| --- | --- |
| `type` | `service` (tiene puerto) o `learning` (solo guía) |
| `healthProtocol` | `http`, `tcp` o `null` |
| `requires` / `installHint` | Binario que prueba "instalado" y pista de instalación |
| `startCommand` / `stopCommand` / `logsCommand` | Se ejecutan en WSL vía `wsl.exe -d <distro> -u root -- bash -lc "…"` |
| `$WSL_LABS_ROOT` | Marcador que el servidor **sustituye por la ruta literal** del repo (no lo expande el shell) |

> [!IMPORTANT]
> `wsl.exe -- bash -lc "…"` **no expande** variables de shell asignadas en el
> propio comando. Por eso el Control Center reemplaza `$WSL_LABS_ROOT` por la
> ruta real antes de ejecutar. No confíes en variables de entorno dentro de los
> comandos del catálogo.

### 3 · Servicios: systemd vs `service`

En `wsl-labs` conviven dos formas de correr un servicio, según lo que ofrezca el
paquete:

| Mecanismo | Servicios | Nota |
| --- | --- | --- |
| 🧩 **Unidad systemd** | `node` (`wsl-labs-node`), `flask` (`wsl-labs-flask`) | La crea su `install-*.sh`; sobrevive a reinicios de la instancia WSL |
| 🔧 `sudo service …` | nginx, apache, postgresql | Servicios clásicos de la distro |

> [!WARNING]
> Los procesos lanzados "en background" (`&`) **mueren** cuando WSL apaga la
> instancia. Si tu servicio no se registra como unidad systemd ni como
> `service`, no persistirá. Por eso node/flask se modelan como **unidades
> systemd habilitadas**.

### 4 · `install-*.sh` idempotentes

Cada servicio nuevo necesita su instalador en `scripts/`:

- Debe ser **idempotente**: re-ejecutarlo no rompe nada.
- Debe imprimir al final `[wsl-labs] <servicio> OK en :<puerto>` (o el fallo).
- Se ejecuta como **root** desde el panel (`POST /api/wsl/install`).

### 5 · README del lab (plantilla)

```markdown
# 🧪 NN · Nombre del lab

| Dato | Valor |
|---|---|
| Tipo | ⚙️ service / 📚 learning |
| Puerto | 2222 (o —) |
| Estado | ✅ ready |

## 🚀 Ejecutar (WSL)

​```bash
sudo service ssh start
​```

## ✅ Verificar

​```bash
ss -tulpn | grep 2222
​```

## 🧭 Desde el Control Center

Botón **Levantar** en la tarjeta del lab, o `POST /api/wsl/start { "id": "NN" }`.

## 🎯 Por qué importa

Breve explicación del concepto de WSL2 que enseña este lab.
```

---

## 🖥️ Cómo tocar el Control Center

El Control Center es un servidor Node.js con el módulo `http` **nativo** (sin
dependencias npm). Escucha **solo en `127.0.0.1:9092`** y ejecuta comandos en
WSL como `root` (`wsl.exe -u root`, sin contraseña, estilo Docker).

| Endpoint | Método | Uso |
| --- | --- | --- |
| `/api/overview` | GET | Estado global de todos los labs |
| `/api/health/:id` | GET | Salud de un servicio |
| `/api/wsl/start` | POST | Levanta el servicio del `id` indicado |
| `/api/wsl/stop` | POST | Detiene el servicio |
| `/api/wsl/install` | POST | Corre el `install-*.sh` como root |
| `/api/wsl/logs` | POST | Últimas líneas de log |

> [!IMPORTANT]
> El Control Center corre en WSL como `root` sin contraseña, igual que Docker
> corre privilegiado. **No lo expongas a la red**: mantenlo en `127.0.0.1`.
> Si tocas el binding o la seguridad, revisa [SECURITY.md](SECURITY.md).

Reglas al modificar el servidor:

- No introduzcas dependencias npm: se mantiene "solo stdlib".
- Respeta el rate-limit nativo y el token opcional `WSL_LABS_TOKEN`.
- Cachea positivos de "instalado" para evitar parpadeos por sondas lentas.
- Prueba health en **IPv4 e IPv6** (como `curl localhost`).

---

## ✅ Validación local

Antes de abrir un PR, ejecuta lo que aplique a tu cambio:

```powershell
# 1. Catálogo + disponibilidad local (equivale al workflow dashboard)
node dashboard-server/verify-localhost.js
#   o
make test-dashboard

# 2. Levanta el servicio y comprueba localhost
Invoke-RestMethod -Method Post -Headers @{ 'Content-Type'='application/json' } `
  -Body '{ "id": "13" }' http://localhost:9092/api/wsl/start
Invoke-RestMethod http://localhost:9092/api/health/13
```

Los mismos checks que corre CI (replícalos en local cuando puedas):

| Workflow | Qué valida | Herramienta |
| --- | --- | --- |
| `docs.yml` | Markdown de todo el repo | markdownlint-cli2 |
| `scripts.yml` | `*.sh` y `*.ps1` | shellcheck + PSScriptAnalyzer |
| `dashboard.yml` | Catálogo y dashboard | `verify-localhost.js` (Node) |
| `build-windows.yml` | Launcher + instalador | Solo en tag `vX.Y.Z` |

> [!TIP]
> Para el launcher Go, compila local con
> `cd launcher\windows; go build -ldflags "-X main.launcherVersion=0.1.0" -o wsl-labs-launcher.exe .`

---

## 🌿 Flujo git sugerido

1. 🌿 Crea una rama descriptiva.
2. ✏️ Haz cambios pequeños y verificables (catálogo + README + `install-*.sh`).
3. 📖 Actualiza docs si cambias flujo operativo.
4. ✅ Corre las validaciones que apliquen.
5. 🚀 Abre el PR con contexto claro.

```text
feat: add ssh service lab (13) to catalog
fix: harden localhost dashboard health check for IPv6
docs: align WSL setup with install-base script
```

---

## 🤖 Skills de automatización

> [!NOTE]
> `wsl-labs` **no tiene aún skills de Claude Code dedicados**. El flujo de
> release y validación se hace con los scripts PowerShell (`scripts/windows/`)
> y los comandos `make` descritos arriba.

---

📖 Ver también: [RUNBOOK.md](RUNBOOK.md) · [RELEASE.md](RELEASE.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/MAINTAINERS.md](docs/MAINTAINERS.md) · [FILE_ARCHITECTURE.md](FILE_ARCHITECTURE.md)
