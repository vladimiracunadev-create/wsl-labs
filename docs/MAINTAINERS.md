# 🛡️ Maintainers Guide

Guía para mantenedores de `wsl-labs`. Complementa la
[guía de desarrollo](../DEVELOPING.md) con las responsabilidades de quien
**cuida la dirección y la calidad** del proyecto.

---

## 🎯 Rol del maintainer

Un maintainer en `wsl-labs` debe cuidar:

- 🧭 la **coherencia** entre código, catálogo (`labs.config.json`) y documentación
- 🐧 la dirección del proyecto: un panel operable de servicios Linux sobre **WSL2**
- 🧪 la calidad mínima de cada lab (service y learning)
- 🔒 que el Control Center siga siendo **local only** (`127.0.0.1`, sin exposición a red)

---

## 📋 Responsabilidades

- 👀 Revisar PRs con criterio (ver checklist más abajo).
- 🧩 Decidir si un lab nuevo **realmente aporta** un concepto de WSL2.
- 📇 Proteger la regla del **catálogo único**: puertos y comandos viven en
  `labs.config.json`, no duplicados en el dashboard.
- 📝 Evitar que la documentación prometa más de lo que el código entrega.
- 🚀 Gestionar los releases (ver [RELEASE.md](../RELEASE.md)).

---

## ✅ Checklist antes de aceptar un PR

| Criterio | Qué mirar |
| --- | --- |
| 🐧 Levanta de verdad | El servicio instala y responde en su puerto (`healthy`) |
| 📇 Catálogo coherente | Cambios de puerto/comando están en `labs.config.json` y en el README del lab |
| 🧩 systemd vs service correcto | Servicios que no persisten como proceso están modelados como unidad systemd |
| 🔧 `install-*.sh` idempotente | Se puede re-instalar sin romper nada; imprime OK final |
| 📖 Docs alineadas | README, RUNBOOK y guías coinciden con lo entregado |
| 🔒 Sin exposición a red | Nada cambia el binding de `127.0.0.1` sin justificación en SECURITY |
| ✅ CI en verde | `docs.yml`, `scripts.yml` y `dashboard.yml` pasan |
| 🎯 Aporta | El lab/mejora tiene justificación y no añade puertos en conflicto |

---

## 🔍 Criterios de calidad

- **Un puerto por servicio, fijo y previsible.** Nada de puertos aleatorios.
- **Estilo editorial homogéneo**: español, emoji por sección, callouts
  (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`), tablas y cross-links correctos.
- **Sin dependencias innecesarias**: el Control Center es Node.js *stdlib* y el
  launcher es Go *stdlib*. Mantén ambos sin paquetes externos.
- **Comandos seguros en el catálogo**: recuerda que corren como `root` en WSL.

---

## 🚀 Gestión de releases

El maintainer es responsable de que cada release quede coherente:

1. `version.txt` es la fuente de verdad; el tag `vX.Y.Z` debe coincidir.
2. CHANGELOG actualizado antes del tag.
3. El workflow `build-windows.yml` termina en verde y el `.exe` queda adjunto.

El detalle completo del flujo está en [RELEASE.md](../RELEASE.md).

> [!NOTE]
> `wsl-labs` **no tiene aún skills de Claude Code dedicados**. El release se
> orquesta con `scripts/windows/release.ps1`. Si en el futuro se añaden skills,
> documéntalos aquí y en [DEVELOPING.md](../DEVELOPING.md).

---

## 📚 Lecturas recomendadas

- [README](../README.md)
- [Developing](../DEVELOPING.md)
- [Release Guide](../RELEASE.md)
- [Contributing](../CONTRIBUTING.md)
- [Operating Modes](../OPERATING-MODES.md)
- [ROADMAP](../ROADMAP.md)
