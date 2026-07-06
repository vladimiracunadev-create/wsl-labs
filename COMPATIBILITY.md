# 🔀 COMPATIBILITY — WSL Control Center v1

> Plataformas soportadas, matriz de validación y riesgos operativos.
> Para el setup, consulta [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 🎯 Resumen ejecutivo

La experiencia principal está diseñada para:

- 🪟 **Windows 11** (o Windows 10 2004+) con **WSL2** habilitado
- 🐧 **Ubuntu o Debian** dentro de WSL2
- 🟢 **Node.js 18+** en el PATH de **Windows** (para el Control Center)
- 🚀 **Go 1.21+** (solo para compilar el launcher)
- 🌐 Control Center en `localhost:9092` como capa de control

---

## 📊 Versiones soportadas

| Componente | Mínimo soportado | Recomendado | Notas |
| --- | --- | --- | --- |
| 🪟 Windows | 10 versión **2004** (build 19041) | Windows 11 | WSL2 requiere 2004+ |
| 🐧 WSL | **WSL 2** | WSL 2 | WSL 1 no soporta la topología de servicios |
| 🐧 Distro | Ubuntu 20.04 / Debian 11 | Ubuntu 22.04+ | Otras distros: parcial |
| 🟢 Node.js | **18 LTS** | 20 LTS+ | Corre en Windows, sin deps npm |
| 🚀 Go | **1.21** | 1.22+ | Solo para compilar el launcher |
| 🌐 Navegador | Cualquiera moderno | Edge / Chrome | Para abrir `:9092` |

---

## 🧩 Matriz de plataformas

| Plataforma | Control Center | Launcher | Servicios | Notas |
| --- | :---: | :---: | :---: | --- |
| 🪟 Windows 11 + WSL2 | ✅ | ✅ | ✅ | **Ruta principal validada** |
| 🪟 Windows 10 2004+ + WSL2 | 🟡 | 🟡 | 🟡 | Compatible, no validado explícitamente |
| 🐧 Linux nativo | 🟡 | ❌ | ✅ | Útil para probar servicios directamente |
| 🍎 macOS | 🟡 | ❌ | 🟡 | Solo lectura y desarrollo parcial |
| ☁️ Linux en CI (Actions) | 🟡 | ✅ | 🟡 | Build del launcher validado |

**Leyenda:** ✅ validado · 🟡 parcial / no validado · ❌ no soportado

---

## 🔧 Requisitos de operación

El dashboard ejecuta los comandos dentro de WSL **como `root`** vía
`wsl.exe -d Ubuntu -u root -- …`, así que **no requiere passwordless sudo**: nunca
pide contraseña (igual que Docker corre privilegiado). Desde el panel basta:

1. **📦 Instalar** — el botón corre el `install-*.sh` del servicio como `root`
   (endpoint `POST /api/wsl/install`).
2. **▶ Levantar** — arranca el servicio, sin contraseña.

| Servicio | Lab | Puerto | Desde el panel (root) | passwordless sudo |
| --- | :---: | ---: | :---: | :---: |
| 🌐 nginx | 05 | 8080 | ✅ 1-click | opcional (solo terminal) |
| 🐘 apache + php | 06 | 8081 | ✅ 1-click | opcional (solo terminal) |
| 🗄️ postgresql | 09 | 5432 | ✅ 1-click | opcional (solo terminal) |
| 🟢 node API | 07 | 8082 | ✅ 1-click | no aplica (sin `sudo`) |
| 🐍 flask | 08 | 8083 | ✅ 1-click | no aplica (sin `sudo`) |

> [!IMPORTANT]
> `scripts/setup-passwordless-sudo.sh` **ya no es requisito del dashboard**. Solo
> es útil si ejecutas los targets `make up-*` desde una terminal **como tu propio
> usuario** (no `root`), porque en ese flujo el arranque usa `sudo service …`.

---

## 🪟 Windows + WSL2 — Ruta principal

Es la ruta del producto. En esta iteración se valida:

- ✅ Control Center en `localhost:9092`
- ✅ Detección de `Ubuntu` con `wsl.exe -l -q`
- ✅ Arranque de nginx con `sudo service nginx start`
- ✅ Respuesta real en `http://localhost:8080`
- ✅ Health `http`/`tcp` de los servicios del catálogo

### Repo en filesystem Windows

```text
C:\dev\wsl-labs   →   /mnt/c/dev/wsl-labs (desde WSL)
```

El Control Center hace esa conversión automáticamente y exporta `WSL_LABS_ROOT`.

### Repo en filesystem Linux

Buena opción para trabajo prolongado desde WSL (I/O más rápida en `~`).

---

## ⚠️ Riesgos conocidos

> [!CAUTION]
> Estos riesgos pueden impedir el arranque de los servicios:

| # | Riesgo | Impacto | Mitigación |
| --- | --- | --- | --- |
| 1 | **systemd no habilitado** en la distro | 🟠 Alto | Usar `sudo service <x> start` (ya es el default del catálogo) o habilitar systemd en `/etc/wsl.conf` con `[boot]\nsystemd=true` |
| 2 | **`sudo` pide contraseña** para servicios | 🟠 Alto | Configurar `sudoers` sin password para los servicios usados (ver abajo) |
| 3 | WSL en **versión 1** | 🔴 Crítico | Convertir con `wsl --set-version <distro> 2` |
| 4 | **Node.js dentro de WSL**, no en Windows | 🔴 Crítico | El Control Center corre en Windows; instala Node en Windows |
| 5 | **Colisión de puertos** en localhost | 🟠 Alto | Verificar con `netstat -ano \| findstr <puerto>` |
| 6 | Paquetes de servicio no instalados | 🟡 Medio | Ejecutar `scripts/install-base.sh` dentro de WSL |
| 7 | Virtualización deshabilitada en BIOS | 🔴 Crítico | Habilitar VT-x/AMD-V y la característica "Plataforma de máquina virtual" |

### 🔑 sudoers sin password (opcional)

Para que el Control Center arranque servicios sin que `sudo` pida contraseña,
añade dentro de WSL (`sudo visudo`):

```text
tu_usuario ALL=(ALL) NOPASSWD: /usr/sbin/service, /usr/bin/service
```

> [!WARNING]
> `NOPASSWD` reduce la fricción operativa pero relaja la seguridad local.
> Limítalo a los binarios `service` estrictamente necesarios.

---

## 📐 Reglas de diseño

- La UX principal se cuenta **desde Windows**
- El runtime real sigue siendo **Linux (WSL2)**
- Los puertos deben ser **estables** (ver [RUNBOOK.md](RUNBOOK.md))
- `labs.config.json` es la **fuente de verdad**
- El launcher sigue el mismo catálogo y la misma topología de `localhost`

---

📖 Ver también: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) · [RUNBOOK.md](RUNBOOK.md) · [SECURITY.md](SECURITY.md)
