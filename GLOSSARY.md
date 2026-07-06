# 📖 Glossary

> **Estado**: Activo
> **Uso recomendado**: Lectura rápida cuando un término de `wsl-labs` no se
> entiende a la primera. Ideal para principiantes.

---

## 🐳 Términos de contenedores (`wslc`)

| Término | Significado |
| --- | --- |
| **`wslc`** | Motor de contenedores **nativo de WSL** (WSL 2.9+), tipo Docker. Ejecutable: `C:\Program Files\WSL\wslc.exe`. Se obtiene con `wsl --update --pre-release` |
| **Contenedor** | Instancia en ejecución de una imagen; aislada, con su propio filesystem y red. Se crea con `wslc run` |
| **Imagen** | Plantilla OCI por capas desde la que se crean contenedores. Se construye con `wslc build` (desde un `Dockerfile`) o se descarga con `wslc pull` |
| **Dockerfile** | Receta de una imagen propia (`FROM …`, `COPY`, `CMD`). Solo lo tienen los casos con imagen propia |
| **Red `wslc`** | Red virtual que conecta varios contenedores de un caso; se resuelven por nombre (DNS interno). Se gestiona con `wslc network` |
| **`wslc.exe`** | Ejecutable de Windows del motor de contenedores (`wslc build/run/logs/stop/rm/images/list/network`) |

---

## 🧭 Términos del workspace

| Término | Significado |
| --- | --- |
| **Panel** | Panel principal Node.js en `localhost:9092`; construye, levanta, baja y muestra logs de los contenedores |
| **Caso** | Unidad del catálogo: un contenedor (o stack) empaquetado en `containers/NN-nombre/`, portado de `docker-labs` o nuevo |
| **Catálogo** | `containers/containers.config.json`: **fuente única de verdad** de casos, puertos, imágenes, contenedores y redes |
| **Launcher** | App de Windows (Go `.exe`) que verifica WSL, arranca el panel y abre el navegador |
| **Categoría** | Agrupación de un caso en el panel: `starter`, `platform` o `infra` |

---

## 🔧 Términos operativos

| Término | Significado |
| --- | --- |
| **Construir** | Crear la imagen propia de un caso (botón 🔨, o `POST /api/wslc/build`) — solo casos con `Dockerfile` |
| **Levantar** | Crear la red (si aplica) y arrancar los contenedores del caso (botón ▶, o `POST /api/wslc/up`) |
| **Bajar** | Detener y eliminar los contenedores del caso (botón 🛑, o `POST /api/wslc/down`) |
| **Logs** | Últimas líneas de log de los contenedores (`POST /api/wslc/logs`) |
| **Health** | Chequeo de salud del caso en su puerto host (protocolo `http`) |
| **Puerto host → contenedor** | Mapeo `HOST:CONTENEDOR` (p. ej. `8101:3000`): el puerto de Windows que se publica y el interno del contenedor |

---

## 🐧 Términos de WSL (contexto)

> [!NOTE]
> Estos términos son **documentación de contexto**. El foco operativo del repo son
> los contenedores `wslc`; WSL es la base sobre la que corre el motor.

| Término | Significado |
| --- | --- |
| **WSL** | *Windows Subsystem for Linux*. Capa que permite correr Linux dentro de Windows |
| **WSL 2** | Segunda generación de WSL: kernel Linux real sobre una VM ligera. `wslc` requiere **WSL 2.9+** |
| **`wsl.exe`** | Ejecutable de Windows que controla WSL (`wsl --version`, `wsl --update`, `wsl -l -v`) |
| **`wsl --update --pre-release`** | Actualiza WSL a la rama preview, que incluye el motor de contenedores `wslc` |

---

## 📦 Términos de distribución (Windows)

| Término | Significado |
| --- | --- |
| **`version.txt`** | Fuente única de la versión del proyecto |
| **Tag `vX.Y.Z`** | Etiqueta git que dispara el build del launcher + instalador en GitHub Actions |
| **Inno Setup** | Herramienta que empaqueta el launcher en el instalador `wsl-labs-setup-X.Y.Z.exe` (`installer/wsl-labs.iss`) |
| **Launcher** | El `.exe` Go que arranca el panel; ver arriba |
| **Release** | Publicación en GitHub con el `.exe` adjunto como asset |

---

## ⚙️ Términos de CI/CD

| Workflow | Qué hace |
| --- | --- |
| `docs.yml` | Lint de Markdown (markdownlint-cli2) |
| `dashboard.yml` | Verifica el catálogo y el panel (`verify-localhost.js`) |
| `build-windows.yml` | Compila launcher + instalador Inno Setup al pushear un tag `vX.Y.Z` |

---

📖 Ver también: [FAQ.md](FAQ.md) · [OPERATING-MODES.md](OPERATING-MODES.md) · [RUNBOOK.md](RUNBOOK.md) · [docs/wslc-contenedores.md](docs/wslc-contenedores.md)
