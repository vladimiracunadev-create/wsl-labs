# 🛡️ Maintainers Guide

Guía para mantenedores de `wsl-labs`. Complementa la
[guía de desarrollo](../DEVELOPING.md) con las responsabilidades de quien
**cuida la dirección y la calidad** del proyecto.

> [!NOTE]
> `wsl-labs` es un **WSL Container Center**: levanta contenedores con `wslc`.
> Las guías de fundamentos de WSL (`docs/00-05`, historia, cheatsheets) quedan
> como **documentación de contexto**, no como flujo operativo.

---

## 🎯 Rol del maintainer

Un maintainer en `wsl-labs` debe cuidar:

- 🧭 la **coherencia** entre código, catálogo (`containers/containers.config.json`) y documentación
- 🐳 la dirección del proyecto: un panel que construye y levanta **contenedores** con `wslc`
- 🧪 la calidad mínima de cada caso (contenedor único o stack)
- 🔒 que el panel siga siendo **local only** (`127.0.0.1`, sin exposición a red)

---

## 📋 Responsabilidades

- 👀 Revisar PRs de casos con criterio (ver checklist más abajo).
- 🧩 Decidir si un caso nuevo **realmente aporta** (portado útil de `docker-labs` o caso propio con sentido).
- 📇 Proteger la regla del **catálogo único**: puertos, imágenes y contenedores
  viven en `containers/containers.config.json`, no duplicados en el dashboard.
- 📝 Evitar que la documentación prometa más de lo que el código entrega.
- 🚀 Gestionar los releases (ver [RELEASE.md](../RELEASE.md)).

---

## ✅ Checklist antes de aceptar un PR de caso

| Criterio | Qué mirar |
| --- | --- |
| 🐳 Levanta de verdad | El caso construye (si tiene imagen propia) y responde en su puerto host |
| 📇 Catálogo coherente | Puertos/imágenes/contenedores están en `containers.config.json` y en el README del caso |
| 📁 Estructura correcta | Carpeta `containers/NN-nombre/` con `Dockerfile` (si imagen propia) + `README.md` |
| 🕸️ Red bien modelada | Si es multi-contenedor, hay `network` y las apps referencian por nombre |
| 🔢 Puerto sin colisión | El puerto host es único dentro del catálogo (parten de `8100`) |
| 📖 Docs alineadas | README del caso, RUNBOOK y guías coinciden con lo entregado |
| 🔒 Sin exposición a red | Nada cambia el binding de `127.0.0.1` sin justificación en SECURITY |
| ✅ CI en verde | `docs.yml` y `dashboard.yml` pasan |

---

## 🔍 Criterios de calidad

- **Un puerto host por caso, fijo y previsible.** Nada de puertos aleatorios.
- **Estilo editorial homogéneo**: español, emoji por sección, callouts
  (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`), tablas y cross-links correctos.
- **Sin dependencias innecesarias**: el panel es Node.js *stdlib* y el launcher es
  Go *stdlib*. Mantén ambos sin paquetes externos.
- **Imágenes propias reproducibles**: `Dockerfile` claro, base fijada por tag.
- **Cuidado con casos pesados** (Elasticsearch, Jenkins): documenta el consumo de RAM.

---

## 🚀 Gestión de releases

El maintainer es responsable de que cada release quede coherente:

1. `version.txt` es la fuente de verdad; el tag `vX.Y.Z` debe coincidir.
2. CHANGELOG actualizado antes del tag.
3. El workflow `build-windows.yml` (launcher Go + instalador Inno Setup) termina
   en verde y el `.exe` queda adjunto.

El detalle completo del flujo está en [RELEASE.md](../RELEASE.md).

---

## 📚 Lecturas recomendadas

- [README](../README.md)
- [Developing](../DEVELOPING.md)
- [Release Guide](../RELEASE.md)
- [Contributing](../CONTRIBUTING.md)
- [Operating Modes](../OPERATING-MODES.md)
- [ROADMAP](../ROADMAP.md)
