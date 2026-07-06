# 🧯 Resolución de problemas — wsl-labs

> Problemas comunes al operar el Control Center y los servicios WSL, en formato
> **problema → causa → solución**.
> Para el registro de lecciones estructurales, ver el lab
> [`12-troubleshooting`](../labs/12-troubleshooting/) y los
> [cheatsheets](../cheatsheets/troubleshooting.md).

---

## 🐧 WSL no arranca

**Problema:** `wsl --status` o `wsl -l -v` fallan, o la distro no abre.

**Causa:** WSL2 no habilitado, virtualización desactivada en BIOS, o la distro
en versión 1.

**Solución:**

```powershell
wsl --status              # ¿WSL en modo 2?
wsl -l -v                 # ¿tu distro con VERSION 2?
```

- Si la distro está en **VERSION 1**: `wsl --set-version Ubuntu 2`.
- Si WSL no está instalado: `wsl --install` y reinicia.
- Habilita en BIOS/UEFI la **virtualización** (VT-x / AMD-V) y en Windows la
  característica **"Plataforma de máquina virtual"**.

---

## 🔌 Puerto ocupado

**Problema:** un servicio queda **degraded** o **stopped**, o el panel no
levanta en `:9092`.

**Causa:** otro proceso de Windows ya usa ese puerto (8080, 8082, 9092…).

**Solución:**

```powershell
netstat -ano | findstr 8080      # ¿quién usa el puerto?
tasklist | findstr <PID>          # identifica el proceso
```

Cierra el proceso que ocupa el puerto, o cambia el puerto del servicio en
[`labs.config.json`](../labs.config.json) de forma consciente. Ver la tabla de
puertos en [Requisitos](REQUIREMENTS.md#-puertos).

---

## ⚙️ Un servicio no levanta

**Problema:** pulsas **▶ Levantar** y el servicio no pasa a **healthy**.

**Causa:** no está instalado, systemd no está activo, o el paquete falló al
instalarse.

**Solución:**

1. Si el estado es **📦 No instalado**, pulsa **📦 Instalar** primero
   (`install-*.sh` como root, idempotente).
2. Revisa **📄 Logs** en la tarjeta del servicio (`POST /api/wsl/logs`).
3. Prueba a mano dentro de WSL:

```powershell
wsl -d Ubuntu -- bash -lc "service nginx status"
wsl -d Ubuntu -- bash -lc "systemctl status wsl-labs-node --no-pager"
```

1. Reinstala si hace falta (es idempotente):

```powershell
wsl bash scripts/install-nginx.sh
```

---

## ⚙️ systemd no activo (node / flask no arrancan)

**Problema:** los servicios `07 node` y `08 flask` no levantan; los servicios
`service` (nginx/apache/postgres) sí.

**Causa:** `node` y `flask` son **unidades systemd** (`wsl-labs-node`,
`wsl-labs-flask`). Si systemd no está habilitado en la distro, `systemctl` falla.

**Solución:** habilita systemd en `/etc/wsl.conf` dentro de WSL:

```ini
[boot]
systemd=true
```

Luego, desde Windows:

```powershell
wsl --shutdown
wsl -d Ubuntu -- bash -lc "systemctl is-system-running"
```

> [!NOTE]
> Los servicios `service` (nginx/apache/postgres) usan `service <x> start` y no
> dependen de systemd, por eso pueden funcionar aunque systemd esté apagado.

---

## 🧭 El panel no responde

**Problema:** `http://localhost:9092` no abre o la API no responde.

**Causa:** el Control Center no está corriendo, o Node.js no está en el PATH de
Windows.

**Solución:**

```powershell
node --version                       # ¿Node 18+ en Windows?
cd C:\dev\wsl-labs
node dashboard-server/server.js      # o: make serve
```

- Comprueba que responde: `Invoke-RestMethod http://localhost:9092/api/overview`.
- Recuerda que escucha **solo en `127.0.0.1`** (no en la red, por diseño).
- Si activaste `WSL_LABS_TOKEN`, añade el header
  `Authorization: Bearer <token>` a las llamadas `/api`.

---

## 💓 La instancia WSL se apaga sola (keepalive)

**Problema:** levantas servicios y al rato "desaparecen" o dejan de responder.

**Causa:** WSL se apaga por inactividad y tira abajo los servicios.

**Solución:** mantén el **Control Center abierto**: mientras corre, el
**keepalive** mantiene viva la instancia WSL (como Docker Desktop con su VM).

- Con el panel abierto → WSL sigue viva.
- Si cerraste el panel → vuelve a abrirlo; los servicios `service` están
  `enabled` y los `systemd` (`node`, `flask`) rearrancan solos en el siguiente boot.

---

## 🔑 sudo / root

**Problema:** operando por **terminal** (`make up-*`), `sudo` pide contraseña y
el arranque se cuelga.

**Causa:** el flujo de terminal usa `sudo service …` como tu propio usuario.

**Solución:**

- **Desde el panel no aplica**: el Control Center corre como `root`
  (`wsl.exe -u root`), sin contraseña. Usa el panel.
- Para el flujo de terminal, configura passwordless sudo:

```powershell
wsl bash scripts/setup-passwordless-sudo.sh
```

> [!IMPORTANT]
> `setup-passwordless-sudo.sh` **no** es necesario para el panel. Solo sirve al
> flujo `make up-*` por terminal. Ver [COMPATIBILITY.md](../COMPATIBILITY.md).

---

## 📦 El panel dice "No instalado" aunque instalé

**Problema:** un servicio muestra **No instalado** pese a haberlo instalado.

**Causa:** sonda de binarios lenta o realizada antes de terminar la instalación.

**Solución:** refresca el panel. La detección **cachea y acumula positivos**: una
vez detectado como instalado, no vuelve a marcarse "No instalado". Si persiste,
verifica el binario dentro de WSL:

```powershell
wsl -d Ubuntu -- bash -lc "command -v nginx || echo NO"
```

---

## ⚠️ Un servicio queda "degraded"

**Problema:** el estado es **degraded** ⚠️ (puerto abierto, pero HTTP da error).

**Causa:** el servicio arrancó pero su config o backend fallan.

**Solución:**

1. Revisa **📄 Logs** del servicio.
2. Para el mini-servidor (11), valida el vhost nginx:

```powershell
wsl -d Ubuntu -u root -- bash -lc "nginx -t"
```

1. Reinstala/relevanta si la config quedó a medias.

---

## 🧹 Reinicio limpio

**Problema:** varios servicios en estado inconsistente y quieres empezar de cero.

**Solución:**

```powershell
wsl --shutdown                       # detiene TODAS las distros y servicios
```

> [!WARNING]
> `wsl --shutdown` para **todos** los servicios en marcha. Úsalo para un arranque
> limpio, no en medio de una demo. Luego vuelve a abrir el panel y levanta lo que
> necesites.

---

## 🔗 Documentos relacionados

- [Manual de usuario](USER_MANUAL.md)
- [Setup del Control Center](DASHBOARD_SETUP.md)
- [Requisitos](REQUIREMENTS.md)
- [Instalación completa](INSTALL.md)
- [RUNBOOK operativo](../RUNBOOK.md)
- [COMPATIBILITY.md](../COMPATIBILITY.md)
- [Cheatsheet de troubleshooting](../cheatsheets/troubleshooting.md)
