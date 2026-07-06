# 🔐 Política de Seguridad

Política de seguridad para `wsl-labs`.

---

## 🏠 Modelo de exposición

El **Control Center escucha únicamente en `127.0.0.1:9092`** (loopback). No se
enlaza a `0.0.0.0` ni se expone a la red por diseño: es una herramienta de
control **local** entre Windows y WSL2.

```text
🪟 Windows (navegador / launcher)  →  127.0.0.1:9092  →  🐧 WSL2 (wsl.exe)
```

> [!WARNING]
> No expongas el Control Center a la red (port forwarding, `netsh portproxy`,
> túneles). Los endpoints `/api/wsl/*` ejecutan comandos dentro de tu distro
> WSL2 — abrirlos a la red equivale a dar ejecución remota de comandos.

---

## ⚙️ Ejecución como `root` en WSL (modelo de confianza)

El Control Center ejecuta los comandos del catálogo dentro de WSL **como `root`**
vía `wsl.exe -d Ubuntu -u root -- …`. Esto elimina la fricción de contraseñas
(Windows ya autenticó al usuario) y es el mismo **modelo de confianza que Docker
Desktop**: la herramienta corre privilegiada dentro de su runtime.

Consecuencia honesta: **quien pueda acceder al panel puede ejecutar los comandos
del catálogo como `root` en la distro** (instalar paquetes, arrancar/detener
servicios). Mitigaciones:

- 🏠 El servidor **escucha solo en `127.0.0.1`** (loopback), nunca en la red.
- 🔑 Token opcional **`WSL_LABS_TOKEN`** para exigir autorización en `/api/*`.
- 🔒 Solo se ejecutan los **comandos definidos en `labs.config.json`** (no comandos
  arbitrarios).
- ❌ **No expongas el puerto `:9092` a la red** (port forwarding, túneles).

> [!WARNING]
> No abras `:9092` a la red. Con ejecución como `root`, exponerlo equivale a dar
> ejecución remota de comandos privilegiados dentro de tu distro WSL2.

---

## 🔑 Token opcional (`WSL_LABS_TOKEN`)

Por defecto, en modo dev local, la API es **abierta** (el acceso ya está
restringido a loopback). Puedes endurecerla exigiendo un token:

```powershell
$env:WSL_LABS_TOKEN = "un-token-largo-y-aleatorio"
node dashboard-server/server.js
```

Con el token activo, cada llamada a `/api` debe incluir:

```text
Authorization: Bearer un-token-largo-y-aleatorio
```

o la cookie `wsl_labs_token=<token>`.

> [!TIP]
> Activa el token si compartes la máquina con otros usuarios o si corres varias
> sesiones. Genera un valor aleatorio largo; no reutilices contraseñas.

---

## 🛡️ Defensas incluidas

| Defensa | Detalle |
| --- | --- |
| 🏠 Solo loopback | El servidor enlaza a `127.0.0.1`, nunca a la red |
| 🔑 Token opcional | `WSL_LABS_TOKEN` protege `/api/*` |
| 🚦 Rate limiting | 30 req / 60 s por IP en acciones `POST` |
| 📏 Límite de body | 8 KB máximo por request |
| ✅ Validación de `id` | Solo `id` alfanuméricos del catálogo pueden ejecutarse |
| 🔒 Comandos del catálogo | Solo se ejecutan comandos definidos en `labs.config.json` |
| ⚙️ Root vía runtime | Corre como `root` en WSL (estilo Docker); confinado a loopback + catálogo |

---

## 🚨 Reporte de vulnerabilidades

Si encuentras una vulnerabilidad, **no abras un issue público**.

Canales recomendados:

- 🔐 GitHub Security Advisory:
  [Security Advisories](https://github.com/vladimiracunadev-create/wsl-labs/security/advisories)
- 📧 Email privado:
  [vladimir.acuna.dev@gmail.com](mailto:vladimir.acuna.dev@gmail.com)

### Qué incluir

- descripción clara del problema
- pasos para reproducir
- impacto estimado
- lab o componente afectado (`dashboard-server`, `launcher`, un lab…)
- posible mitigación

---

## 📐 Recomendaciones

- ❌ No expongas `:9092` ni los puertos de servicio (`8080`–`8090`, `5432`) a la red
- 🔑 Activa `WSL_LABS_TOKEN` en máquinas compartidas
- 🧹 No reutilices contraseñas de ejemplo de los labs en otros entornos
- 🐧 Revisa qué servicios dejas escuchando dentro de WSL (`ss -tulpn`)
- 🏭 No trates este repo como solución de producción sin endurecimiento adicional

---

📖 Ver también: [COMPATIBILITY.md](COMPATIBILITY.md) · [RUNBOOK.md](RUNBOOK.md)
