# 🔀 COMPATIBILITY — WSL Container Center

> Plataformas soportadas, matriz de validación y riesgos operativos.
> Para el setup, consulta [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 🎯 Resumen ejecutivo

La experiencia principal está diseñada para:

- 🪟 **Windows 11** (o Windows 10 2004+) con **WSL2**
- 🐳 **WSL 2.9+** con el motor de contenedores **`wslc`** (rama preview)
- 🟢 **Node.js 18+** en el PATH de **Windows** (para el panel)
- 🚀 **Go 1.21+** (solo para compilar el launcher)
- 🌐 Panel en `localhost:9092` como capa de control

---

## 📊 Versiones soportadas

| Componente | Mínimo soportado | Recomendado | Notas |
| --- | --- | --- | --- |
| 🪟 Windows | 10 versión **2004** (build 19041) | Windows 11 | WSL2 requiere 2004+ |
| 🐧 WSL | **WSL 2.9+** | Última preview | `wslc` solo existe en 2.9+ (`wsl --update --pre-release`) |
| 🐳 Motor `wslc` | preview | preview | `C:\Program Files\WSL\wslc.exe` |
| 🟢 Node.js | **18 LTS** | 20 LTS+ | Corre en Windows, sin deps npm |
| 🚀 Go | **1.21** | 1.22+ | Solo para compilar el launcher |
| 🌐 Navegador | Cualquiera moderno | Edge / Chrome | Para abrir `:9092` |

---

## 🧩 Matriz de plataformas

| Plataforma | Panel | Launcher | Contenedores `wslc` | Notas |
| --- | :---: | :---: | :---: | --- |
| 🪟 Windows 11 + WSL 2.9+ | ✅ | ✅ | ✅ | **Ruta principal validada** |
| 🪟 Windows 10 2004+ + WSL 2.9+ | 🟡 | 🟡 | 🟡 | Compatible, no validado explícitamente |
| 🪟 Windows + WSL < 2.9 | ❌ | ❌ | ❌ | Sin motor `wslc`: actualiza con `--pre-release` |
| 🍎 macOS / 🐧 Linux nativo | 🟡 | ❌ | ❌ | `wslc` es específico de WSL; solo lectura de docs |

**Leyenda:** ✅ validado · 🟡 parcial / no validado · ❌ no soportado

---

## 🔧 Requisitos de operación

El panel ejecuta `wslc.exe` directamente en **Windows** (`wslc build/run/logs/…`).
**No requiere passwordless sudo, `wsl -u root` ni contraseñas**: Windows ya
autenticó al usuario. Desde el panel basta:

1. **🔨 Construir** — construye la imagen del caso (solo si tiene `Dockerfile`)
   vía `POST /api/wslc/build`.
2. **▶ Levantar** — crea la red (si aplica) y arranca los contenedores vía
   `POST /api/wslc/up`.

| Requisito | Detalle |
| --- | --- |
| `wslc` disponible | `C:\Program Files\WSL\wslc.exe` (o `WSL_LABS_WSLC`) |
| WSL actualizado | `wsl --update --pre-release` deja WSL en 2.9+ con `wslc` |
| Node en Windows | El panel corre en Windows, no dentro de WSL |

> [!IMPORTANT]
> Si `wslc` no aparece tras actualizar, reinicia WSL con `wsl --shutdown` y
> vuelve a comprobar con `& "C:\Program Files\WSL\wslc.exe" version`.

---

## 🪟 Windows + WSL — Ruta principal

Es la ruta del producto. En esta iteración se valida:

- ✅ Panel en `localhost:9092`
- ✅ Localización de `wslc.exe` en `C:\Program Files\WSL\wslc.exe`
- ✅ Construcción de imágenes propias (`wslc build`)
- ✅ Levantado de contenedores y stacks con red (`wslc run` + `wslc network`)
- ✅ Respuesta real en el puerto host de cada caso (HTTP 200)

### Repo en filesystem Windows

```text
C:\dev\wsl-labs
```

El `wslc build` recibe el contexto (`containers/NN-nombre`) directamente desde el
panel, que corre en Windows.

---

## ⚠️ Riesgos conocidos

> [!CAUTION]
> Estos riesgos pueden impedir el arranque de los contenedores:

| # | Riesgo | Impacto | Mitigación |
| --- | --- | --- | --- |
| 1 | **`wslc` en preview** | 🟠 Alto | Es tecnología en evolución; puede cambiar entre versiones de WSL. Fija tu versión con `wsl --version` |
| 2 | **WSL < 2.9 (sin `wslc`)** | 🔴 Crítico | Actualiza con `wsl --update --pre-release` y reinicia con `wsl --shutdown` |
| 3 | **Imágenes pesadas (RAM)** | 🟠 Alto | Elasticsearch y Jenkins consumen mucha memoria; levántalos de uno en uno y ajusta `%UserProfile%\.wslconfig` |
| 4 | **Node.js dentro de WSL**, no en Windows | 🔴 Crítico | El panel corre en Windows; instala Node en Windows |
| 5 | **Colisión de puertos** en localhost | 🟠 Alto | Verifica con `netstat -ano \| findstr <puerto>`; los casos parten de `8100` |
| 6 | **Virtualización deshabilitada en BIOS** | 🔴 Crítico | Habilita VT-x/AMD-V y "Plataforma de máquina virtual" |

---

## 📐 Reglas de diseño

- La UX principal se cuenta **desde Windows** (panel + launcher).
- El runtime real son **contenedores `wslc`** sobre WSL 2.9+.
- Los puertos host deben ser **estables** (ver [RUNBOOK.md](RUNBOOK.md)).
- `containers/containers.config.json` es la **fuente de verdad**.
- El launcher sigue el mismo catálogo y la misma topología de `localhost`.

---

📖 Ver también: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) · [RUNBOOK.md](RUNBOOK.md) · [SECURITY.md](SECURITY.md)
