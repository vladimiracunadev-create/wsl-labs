# 🔀 Mapeo desde docker-labs

> Cómo se traduce cada concepto de `docker-labs` a su equivalente en `wsl-labs`.
> El **motor cambia** (Docker/Compose → WSL2 + servicios Linux nativos), pero la
> arquitectura de producto es la misma. Para el contexto completo, consulta el
> [README.md](../README.md).

---

## 🤝 Qué se conserva

| Aspecto | Descripción |
| --- | --- |
| 📁 Estructura por labs | Directorio numerado `NN-nombre-kebab` por servicio o tema |
| 📖 Narrativa del repo | Aprendizaje progresivo, bien documentado |
| 🏠 Operación local | Sin dependencias de cloud para el flujo principal |
| 🌐 Foco en `localhost` | Los servicios se exponen en puertos locales |
| 🧭 Control Center web | Panel Node.js que gobierna todo desde un puerto |
| 🚀 Launcher Windows (Go) | Un `.exe` que levanta la plataforma y abre el browser |
| 📇 Catálogo fuente de verdad | Un solo archivo define puertos, comandos y health |

---

## 🔄 Tabla de equivalencias conceptuales

| Concepto en docker-labs | 🐧 Equivalente en wsl-labs | Nota |
| --- | --- | --- |
| `docker compose up` | `sudo service <x> start` (vía `wsl.exe`) | El Control Center ejecuta el `startCommand` del catálogo |
| **Contenedor** | **Demonio/proceso Linux en la distro** | nginx, apache, postgres corren nativos dentro de WSL2 |
| **Imagen** | **Paquete apt** | `apt-get install nginx` en lugar de `pull` de una imagen |
| `docker-compose.yml` | Entrada en `labs.config.json` | La fuente única de verdad del servicio |
| **Servicio de compose** | **Lab de tipo `service`** | `id`, `port`, `startCommand`, `healthProtocol` |
| **Puerto publicado** (`-p 8080:80`) | **Port forwarding automático de WSL2** | WSL2 reenvía el puerto de la distro a `localhost` de Windows |
| **Red de compose** | **Red interna de la distro (`localhost`)** | Los servicios se comunican dentro de la misma distro |
| **Volumen** | **Filesystem de la distro / `/mnt/c`** | Interop Windows ↔ WSL vía `/mnt/c/...` |
| **Healthcheck de compose** | `healthProtocol: http\|tcp` | El Control Center hace el check (HTTP GET o TCP connect) |
| `docker compose logs` | `logsCommand` (`tail` de logs en la distro) | `POST /api/wsl/logs { id }` |
| `docker compose down` | `sudo service <x> stop` | `POST /api/wsl/stop { id }` |
| **Docker daemon** | **WSL2 + `wsl.exe`** | El puente que ejecuta comandos dentro de Linux |
| **Docker Desktop** | **WSL2 + Control Center** | La capa de control corre en Windows, el runtime en Linux |
| `dashboard-control` (9090) | **Control Center** (`:9092`) | Mismo rol, distinto motor y puerto |

---

## 🔁 Qué cambia en el motor

| Aspecto | `docker-labs` | `wsl-labs` |
| --- | --- | --- |
| Orquestación | `docker compose` | `wsl.exe -d <distro> -- bash -lc "<cmd>"` |
| Runtime | Docker daemon | Servicios Linux nativos en WSL2 |
| Empaquetado | Imágenes Docker | Paquetes `apt` |
| Aislamiento | Namespaces/cgroups por contenedor | Una distro Linux completa (sin aislamiento por servicio) |
| Puertos | `-p host:container` explícito | Forwarding automático de WSL2 a `localhost` |
| Catálogo | `docker-compose.yml` por lab | `labs.config.json` central |

---

## 🎯 Traducción de puertos

| Servicio | docker-labs (típico) | wsl-labs |
| --- | --- | --- |
| 🌐 Servidor web | contenedor nginx `:8080` | `sudo service nginx start` → `:8080` |
| 🐘 Apache + PHP | contenedor LAMP | `sudo service apache2 start` → `:8081` |
| 🟢 API Node | contenedor node | `node server.js` en la distro → `:8082` |
| 🐍 App Python | contenedor python | `python3 app.py` en la distro → `:8083` |
| 🗄️ PostgreSQL | contenedor postgres `:5432` | `sudo service postgresql start` → `:5432` |
| 🧭 Panel de control | `dashboard-control` `:9090` | Control Center `:9092` |

---

## ✅ Resultado esperado

La experiencia final **no** es "Docker con otro nombre".

Es:

- 🐧 **Servicios Linux reales** dentro de una distro WSL2 (no contenedores)
- 🧭 **Control Center localhost** como panel de control (`:9092`)
- 🚀 **Launcher Windows** como superficie desktop
- 🌐 **Servicios publicados** en puertos fijos vía forwarding de WSL2

> [!NOTE]
> En `docker-labs` cada servicio vive en su **propio contenedor aislado**. En
> `wsl-labs` todos los servicios conviven en la **misma distro Linux**: es más
> cercano a administrar un servidor Linux real que a orquestar contenedores.

---

📖 Ver también: [README.md](../README.md) · [03-wsl-vs-docker-vs-vm.md](03-wsl-vs-docker-vs-vm.md) · [PLAN_PARIDAD.md](PLAN_PARIDAD.md)
