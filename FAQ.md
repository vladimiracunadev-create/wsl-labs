# ❓ FAQ

Preguntas frecuentes sobre `wsl-labs`. Para operar, mira el
[RUNBOOK.md](RUNBOOK.md); para setup, [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 🚪 ¿Cuál es la entrada principal del repo?

El **panel**: <http://localhost:9092>. Desde ahí construyes, levantas, bajas y
revisas los logs de cada **contenedor** (caso) del catálogo.

---

## 🐳 ¿Necesito Docker?

**No.** `wsl-labs` usa **`wslc`**, el motor de contenedores **nativo de WSL**
(WSL 2.9+). No hay Docker Desktop ni daemon de Docker de por medio: `wslc`
construye imágenes OCI y levanta contenedores por sí mismo, con una interfaz casi
idéntica a la de Docker (`wslc build/run/logs/stop/rm/images/list/network`).

---

## 🧩 ¿Qué es `wslc`?

Es el **runtime de contenedores integrado en WSL** que Microsoft añadió a partir
de **WSL 2.9+**. El ejecutable vive en `C:\Program Files\WSL\wslc.exe` y se
obtiene actualizando WSL a la rama preview:

```powershell
wsl --update --pre-release
wsl --version
& "C:\Program Files\WSL\wslc.exe" version
```

> [!NOTE]
> `wslc` está en **preview**. Si no aparece tras actualizar, reinicia WSL con
> `wsl --shutdown` y vuelve a comprobarlo.

---

## 🔑 ¿El panel me pide contraseña?

**No.** El panel ejecuta `wslc.exe` directamente en **Windows** (Windows ya
autenticó al usuario). No usa `wsl -u root`, ni sudo, ni contraseñas para
construir o levantar contenedores.

---

## 🕸️ ¿Puedo levantar varios contenedores y que se comuniquen?

**Sí.** Un caso puede declarar varios contenedores y una **red `wslc`**. Los
contenedores se resuelven por nombre dentro de esa red (DNS interno), igual que
en Docker. Ejemplos del catálogo:

| Caso | Contenedores | Red |
| --- | --- | --- |
| `04-redis-cache` | app Node + `redis:7-alpine` | `wslc-redis-net` |
| `05-postgres-api` | app Python + `postgres:15` | `wslc-pg-net` |
| `02-php-lamp` | PHP+Apache + `mariadb:10.6` | `wslc-lamp-net` |
| `09-multi-service` | backend Node + `mongo:7` | `wslc-multi-net` |
| `08-prometheus-grafana` | Prometheus + Grafana | `wslc-obs-net` |

La app referencia a su dependencia por el nombre del contenedor (p. ej.
`REDIS_HOST=wslc-redis`).

---

## 🐘 ¿Y los casos pesados como Elasticsearch o Jenkins?

Están en el catálogo (`11-elasticsearch`, `12-jenkins`) y funcionan, pero
**consumen bastante RAM**. Elasticsearch arranca con `ES_JAVA_OPTS=-Xms512m
-Xmx512m`; Jenkins LTS también es exigente.

> [!TIP]
> Levántalos de uno en uno y baja el resto de contenedores antes. En equipos con
> poca memoria, ajusta el límite de RAM de WSL en `%UserProfile%\.wslconfig`.

---

## 🗂️ ¿Y los servicios / labs antiguos (`wsl -u root`, `install-*.sh`)?

**Retirados.** El repo ya **no** instala demonios dentro de la distro ni usa
`wsl -u root`, passwordless sudo ni keepalive. Todo eso desapareció al pasar a
contenedores con `wslc`.

Lo que **sí queda** es la documentación de **fundamentos de WSL** (`docs/00-05`,
[historia y referencia](docs/wsl-historia-y-referencia.md), cheatsheets) como
**contexto**: sirve para entender WSL, pero el foco operativo del repo son los
contenedores.

---

## 🆘 ¿Qué hago si `:9092` no abre?

```powershell
wsl --version                    # ¿WSL 2.9+?
& "C:\Program Files\WSL\wslc.exe" version  # ¿wslc disponible?
node --version                   # ¿Node ≥ 18 en Windows?
node dashboard-server/server.js  # arranca el panel manualmente
```

Si sigue sin abrir, revisa [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) y
[SUPPORT.md](SUPPORT.md).

---

## 📦 ¿Cómo levanto un caso?

Desde el panel, en la tarjeta del caso:

1. **🔨 Construir** — solo la primera vez, si el caso tiene imagen propia.
2. **▶ Levantar** — crea la red (si aplica) y arranca los contenedores.
3. **📄 Logs** / **🛑 Bajar** cuando lo necesites.

Los casos que usan imágenes oficiales (RabbitMQ, Prometheus/Grafana, Elastic,
Jenkins) no necesitan Construir: pulsa directamente **Levantar**.

---

## 🪟 ¿Hay un `.exe`?

Sí, el **launcher de Windows** (Go). Descárgalo desde
[Releases](https://github.com/vladimiracunadev-create/wsl-labs/releases): verifica
WSL, arranca el panel y abre el navegador por ti. El instalador se empaqueta con
**Inno Setup**.

> [!NOTE]
> El instalador **no está firmado** en v0.x. Si SmartScreen avisa, elige
> *Más información → Ejecutar de todas formas*.

---

## 🔀 ¿En qué se diferencia de `docker-labs`?

`wsl-labs` **porta 12 casos de `docker-labs`** al motor `wslc`. Comparten la idea
(panel web + casos de contenedor + launcher Windows), pero cambia el motor:

| | `wsl-labs` | `docker-labs` |
| --- | --- | --- |
| Motor | 🐳 **`wslc`** (contenedores nativos de WSL) | 🐳 **Docker** (Docker Engine) |
| Requisito | WSL 2.9+ (`wsl --update --pre-release`) | Docker Desktop / Engine |
| Orquestación | Catálogo `wslc` + panel Node.js | `docker compose` + panel |

> [!NOTE]
> `wsl-labs`, [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs)
> y [`unikernel-labs`](https://github.com/vladimiracunadev-create/unikernel-labs)
> son una **línea** de laboratorios sobre tecnologías para montar sistemas.

---

## ☁️ ¿Sirve para cloud o Kubernetes?

**No.** `wsl-labs` es **local only**: construir y levantar contenedores en tu
Windows con `wslc`. No cubre despliegues cloud ni orquestación con k8s.

---

📖 Ver también: [OPERATING-MODES.md](OPERATING-MODES.md) · [GLOSSARY.md](GLOSSARY.md) · [SUPPORT.md](SUPPORT.md) · [RUNBOOK.md](RUNBOOK.md)
