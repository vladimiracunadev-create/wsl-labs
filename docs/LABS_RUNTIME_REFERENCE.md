# 🧾 Labs Runtime Reference — WSL Labs

> **Versión**: 0.1.2
> **Estado**: 🟢 Activo
> **Objetivo**: Referencia operativa por lab — paquete/servicio, puerto, comando de arranque real, health, unidad systemd y RAM aproximada

---

## 📖 Cómo leer esta tabla

- **Paquete / servicio**: qué se instala y cómo lo gestiona la distro.
- **Puerto**: puerto publicado en `localhost` de Windows.
- **Comando de arranque real**: el `startCommand` tal como el panel lo ejecuta en
  WSL (con `$WSL_LABS_ROOT` ya sustituido por la ruta literal).
- **Health**: protocolo de comprobación (`http`, `tcp` o `—`).
- **Unidad systemd**: nombre de la unidad propia, si aplica.
- **RAM aprox.**: memoria razonable para levantar ese servicio, orientativa.

Los valores de RAM son estimaciones para presupuestar el entorno, no un
reemplazo de la medición real en tu máquina.

---

## 🖥️ Requisitos globales

### Software mínimo

- Windows 10 (2004+) o Windows 11 con **WSL 2**
- Distro Ubuntu/Debian con **systemd** habilitado
- Node.js 18+ (para el Control Center)
- Navegador moderno

### Hardware recomendado por escenario

| Escenario | CPU | RAM | Disco libre |
| --- | ---: | ---: | ---: |
| Panel + labs de aprendizaje | 2 núcleos | 4 GB | 10 GB |
| Panel + 1–2 servicios livianos (`05`, `07`) | 4 núcleos | 8 GB | 15 GB |
| Panel + stack combinado (`11`) o varios servicios | 4 núcleos | 8 GB | 20 GB |

---

## ⚙️ Matriz de servicios (labs de service)

| Lab | Paquete / servicio | Puerto | Comando de arranque real | Health | Unidad systemd | RAM aprox. |
| --- | --- | :---: | --- | :---: | --- | ---: |
| `05-servidor-web-nginx` | `nginx` (apt), `service` del sistema | `8080` | `sudo service nginx start` | `http` | — (servicio del sistema) | `~30 MB` |
| `06-servidor-apache-php` | `apache2` + `php` (apt), `service` | `8081` | `sudo service apache2 start` | `http` | — (servicio del sistema) | `~60 MB` |
| `07-nodejs-entorno-dev` | Node.js 18+ (`http` nativo) | `8082` | `systemctl enable --now wsl-labs-node; systemctl restart wsl-labs-node` | `http` | `wsl-labs-node` (enabled) | `~50 MB` |
| `08-python-entorno-dev` | Python 3 + Flask (venv) | `8083` | `systemctl enable --now wsl-labs-flask; systemctl restart wsl-labs-flask` | `http` | `wsl-labs-flask` (enabled) | `~50 MB` |
| `09-postgresql-en-wsl` | `postgresql` (apt), `service` | `5432` | `sudo service postgresql start` | `tcp` | — (servicio del sistema) | `~80 MB` |
| `11-mini-servidor-completo` | nginx (vhost propio) + postgresql | `8090` | Instala `nginx-mini.conf` en `sites-available`, enlaza en `sites-enabled`, `nginx -t` y recarga; luego `service postgresql start` | `http` | — (vhost + servicios del sistema) | `~110 MB` |

> [!NOTE]
> `07` y `08` son **servicios systemd habilitados** creados por sus
> `install-*.sh`: arrancan solos en cada boot de la instancia WSL, a diferencia
> de un proceso en background que moriría al reiniciarse la distro.

### Comandos de parada y logs

| Lab | Stop | Logs |
| --- | --- | --- |
| `05` | `sudo service nginx stop` | `tail /var/log/nginx/access.log` |
| `06` | `sudo service apache2 stop` | `tail /var/log/apache2/access.log` |
| `07` | `systemctl stop wsl-labs-node` | `journalctl -u wsl-labs-node -n 50` |
| `08` | `systemctl stop wsl-labs-flask` | `journalctl -u wsl-labs-flask -n 50` |
| `09` | `sudo service postgresql stop` | `tail /var/log/postgresql/*.log` |
| `11` | Quita el vhost de `sites-enabled` y recarga nginx | `tail /var/log/nginx/access.log` |

---

## 📚 Labs de aprendizaje (sin runtime)

No instalan paquetes ni exponen puerto; `healthProtocol` es `null`.

| Lab | Foco | Puerto | Health |
| --- | --- | :---: | :---: |
| `01-instalacion-ubuntu` | Instalar WSL 2 + Ubuntu | — | — |
| `02-comandos-base-wsl` | Comandos `wsl.exe` y shell | — | — |
| `03-sistema-de-archivos` | Interop y rendimiento de archivos | — | — |
| `04-systemd-servicios` | Habilitar y administrar systemd | — | — |
| `10-backup-export-import` | Exportar/importar/clonar distros | — | — |
| `12-troubleshooting` | Diagnóstico de problemas | — | — |

---

## 💡 Recomendaciones de uso

### Si tienes 4 GB de RAM

- Panel + labs de aprendizaje
- Un solo servicio liviano a la vez (`05` o `07`)

### Si tienes 8 GB de RAM

- Panel + `05` + `07` + `09` a la vez
- O bien el stack combinado `11`

### Si quieres el flujo más rápido

1. `05` (nginx) — verifica el ciclo Instalar → Levantar
2. `09` (postgresql) — servicio TCP
3. `11` (mini-servidor) — integración

---

## 📚 Documentos relacionados

- [LABS_CATALOG.md](LABS_CATALOG.md)
- [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [../labs.config.json](../labs.config.json)
