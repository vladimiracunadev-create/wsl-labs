# 📦 Guía de instalación — wsl-labs

> **Versión**: v1 · **Estado**: 🟢 Activo
> **Audiencia**: 👥 Todos
> **Objetivo**: Instalar y operar `wsl-labs` de punta a punta —
> WSL2 + Ubuntu + Node.js + repo + panel + servicios.

---

## ✅ Requisitos

### Software

| Componente | Dónde | Notas |
| --- | --- | --- |
| 🪟 Windows 10 (2004+) / 11 | host | WSL2 requiere build 19041+ |
| 🐧 WSL 2 + distro Ubuntu/Debian | host | WSL 1 no soporta la topología de servicios |
| 🟢 Node.js 18+ | **Windows** | Para el Control Center (sin deps npm) |
| ⚙️ systemd activo en WSL | WSL | Necesario para `node`/`flask` (unidades systemd) |
| 🚀 Go 1.21+ | Windows | **Solo** para compilar el launcher |
| 🌐 Git · PowerShell / Windows Terminal | host | — |

> [!IMPORTANT]
> Node.js debe estar en el PATH de **Windows**, no dentro de WSL: el panel corre
> en Windows y se comunica con WSL vía `wsl.exe`. Ver [Requisitos](REQUIREMENTS.md).

### Hardware recomendado

| Escenario | CPU | RAM | Disco libre |
| --- | ---: | ---: | ---: |
| Panel + 1 servicio | 2 hilos | 8 GB | 15 GB |
| Panel + varios servicios | 4 hilos | 16 GB | 20 GB |
| Mini-servidor + todo el stack | 4+ hilos | 16 GB+ | 30 GB |

---

## Opción A — Instalar desde fuente

### Paso 1 — Instalar WSL2 + Ubuntu

```powershell
wsl --install
```

Reinicia si es la primera vez. Después verifica:

```powershell
wsl --status        # WSL en modo 2 por defecto
wsl -l -v           # Ubuntu con VERSION 2
```

> [!TIP]
> Si tu distro aparece en **VERSION 1**, conviértela:
> `wsl --set-version Ubuntu 2`. Para el detalle paso a paso, ver
> [ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md).

### Paso 2 — Habilitar systemd en WSL (recomendado)

Los servicios `node` y `flask` son **unidades systemd**. Habilita systemd
editando `/etc/wsl.conf` dentro de WSL:

```ini
[boot]
systemd=true
```

Luego, desde Windows: `wsl --shutdown` y vuelve a abrir la distro.

### Paso 3 — Instalar Node.js 18+ en Windows

Descárgalo de <https://nodejs.org> (LTS) y verifica en PowerShell:

```powershell
node --version      # >= v18
```

### Paso 4 — Clonar el repo

```powershell
git clone https://github.com/vladimiracunadev-create/wsl-labs.git
cd wsl-labs
```

### Paso 5 — Preparar la distro (una vez)

```powershell
wsl bash scripts/install-base.sh
```

### Paso 6 — Arrancar el Control Center

```powershell
make serve
# o:
node dashboard-server/server.js
```

Abre → **<http://localhost:9092>**.

### Paso 7 — Instalar servicios desde el panel

En el panel, por cada servicio que quieras usar:

1. Pulsa **📦 Instalar** (corre el `install-*.sh` como root, sin contraseña).
2. Pulsa **▶ Levantar**.
3. Verifica que pasa a **✅ healthy** y pulsa **🌐 Abrir**.

Eso es todo: el flujo estilo Docker es **📦 Instalar → ▶ Levantar**.

---

## Opción B — Instalar por scripts (terminal)

Alternativa sin panel, operando desde WSL como tu propio usuario.

```powershell
# (1) Herramientas base — idempotente
wsl bash scripts/install-base.sh

# (2) Instalar los servicios que uses — idempotentes
wsl bash scripts/install-nginx.sh        # nginx en :8080
wsl bash scripts/install-apache-php.sh   # apache + php en :8081
wsl bash scripts/install-node.sh         # node (systemd wsl-labs-node) en :8082
wsl bash scripts/install-python.sh       # flask (systemd wsl-labs-flask) en :8083
wsl bash scripts/install-postgresql.sh   # postgresql en :5432

# (3) Passwordless sudo — SOLO para operar por terminal como tu usuario
wsl bash scripts/setup-passwordless-sudo.sh

# (4) Levantar servicios
make up-nginx        # etc.
```

> [!NOTE]
> `setup-passwordless-sudo.sh` **no** hace falta para el panel (usa `-u root`).
> Solo aplica a este flujo de terminal con `make up-*`, que usa `sudo service …`.

---

## Opción C — Launcher / instalador Windows

1. Descarga el instalador desde
   **[GitHub Releases](https://github.com/vladimiracunadev-create/wsl-labs/releases/latest)**.
   El archivo se llama `wsl-labs-setup-<version>.exe` (construido con Inno Setup).
2. Ejecuta el instalador. Si SmartScreen avisa → "Más información" → "Ejecutar de todas formas".
3. Usa el acceso directo **wsl-labs**. El launcher (`wsl-labs-launcher.exe`,
   compilado desde `launcher/windows/main.go`) verifica WSL2, arranca el panel y
   abre el navegador en `http://localhost:9092`.

> [!NOTE]
> El instalador **no** empaqueta WSL2 ni Node.js: deben estar instalados antes.

---

## 🔍 Verificación inicial

| Servicio | URL |
| --- | --- |
| 🧭 Control Center | <http://localhost:9092> |
| 🌐 NGINX (lab 05) | <http://localhost:8080> |
| 🐘 Apache + PHP (lab 06) | <http://localhost:8081> |
| 🟢 Node API (lab 07) | <http://localhost:8082> |
| 🐍 Flask (lab 08) | <http://localhost:8083> |
| 🗄️ PostgreSQL (lab 09) | `postgres://localhost:5432` |

Comprobación automatizada:

```powershell
node dashboard-server/verify-localhost.js
# o
make test-dashboard
```

---

## ⚡ Equipos con recursos limitados

- Deja solo el Control Center (`9092`) arriba.
- Instala y levanta **un servicio a la vez**.
- Usa `wsl --shutdown` para liberar memoria cuando termines (detiene todo).

---

## 📝 Notas de distribución

| Punto | Detalle |
| --- | --- |
| WSL2 / Node.js | El instalador no los empaqueta — deben estar previamente |
| Launcher | `launcher/windows/main.go` → `wsl-labs-launcher.exe` |
| Instalador | Inno Setup → `wsl-labs-setup-<ver>.exe` en Releases |
| Canal oficial | GitHub Releases es la fuente del binario |

---

## 🔗 Documentos relacionados

- [Requisitos](REQUIREMENTS.md)
- [Setup del Control Center](DASHBOARD_SETUP.md)
- [Manual de usuario](USER_MANUAL.md)
- [Resolución de problemas](TROUBLESHOOTING.md)
- [ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md)
- [RUNBOOK operativo](../RUNBOOK.md)
