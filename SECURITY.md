# 🔐 Política de Seguridad

Política de seguridad para `wsl-labs`.

---

## 🏠 Modelo de exposición

El **panel escucha únicamente en `127.0.0.1:9092`** (loopback). No se enlaza a
`0.0.0.0` ni se expone a la red por diseño: es una herramienta de control
**local** que construye y levanta contenedores con `wslc`.

```text
🪟 Windows (navegador / launcher)  →  127.0.0.1:9092  →  🐳 wslc.exe (contenedores)
```

> [!WARNING]
> No expongas el panel a la red (port forwarding, `netsh portproxy`, túneles). Los
> endpoints `/api/wslc/*` construyen imágenes y ejecutan contenedores con `wslc` —
> abrirlos a la red equivale a dar ejecución remota de comandos.

---

## ⚙️ Modelo de confianza: `wslc` en Windows

El panel invoca **`wslc.exe` directamente en Windows** (`wslc build/run/logs/…`),
localizándolo en `C:\Program Files\WSL\wslc.exe`. Windows ya autenticó al
usuario, por eso **no** usa `wsl -u root`, sudo ni contraseñas.

Consecuencia honesta: **quien pueda acceder al panel puede construir imágenes y
levantar contenedores** con `wslc` (que corre con los privilegios del usuario de
Windows). Mitigaciones:

- 🏠 El servidor **escucha solo en `127.0.0.1`** (loopback), nunca en la red.
- 🔑 Token opcional **`WSL_LABS_TOKEN`** para exigir autorización en `/api/*`.
- 🔒 Solo se ejecutan las **acciones definidas en `containers/containers.config.json`**
  (build/up/down/logs de casos del catálogo), no comandos arbitrarios.
- ❌ **No expongas el puerto `:9092` a la red** (port forwarding, túneles).

> [!WARNING]
> No abras `:9092` a la red. Exponerlo equivale a dar a terceros la capacidad de
> construir y ejecutar contenedores en tu máquina.

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
| 🚦 Rate limiting | Límite de solicitudes `POST` por IP |
| 📏 Límite de body | Tamaño máximo por request |
| ✅ Validación de `id` | Solo `id` de casos existentes en el catálogo pueden ejecutarse |
| 🔒 Acciones del catálogo | Solo build/up/down/logs de casos definidos en `containers.config.json` |
| 🐳 `wslc` en Windows | Corre con los privilegios del usuario de Windows; sin sudo ni root en WSL |

---

## 🐳 Contenedores: buenas prácticas

- 🔑 Las contraseñas de ejemplo de los casos (p. ej. `POSTGRES_PASSWORD=wsl-labs`,
  `MARIADB_ROOT_PASSWORD=wsl-labs`) son **para uso local**; no las reutilices en
  otros entornos.
- 🌐 Los contenedores publican puertos en `localhost`. Revisa qué dejas escuchando
  (`& "C:\Program Files\WSL\wslc.exe" list`).
- 🧹 Baja los contenedores que no uses (`down` en el panel) para no dejar puertos
  ni imágenes pesadas ocupando recursos.

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
- caso o componente afectado (`dashboard-server`, `launcher`, un caso…)
- posible mitigación

---

## 📐 Recomendaciones

- ❌ No expongas `:9092` ni los puertos de los casos (`8100`+) a la red.
- 🔑 Activa `WSL_LABS_TOKEN` en máquinas compartidas.
- 🧹 No reutilices las contraseñas de ejemplo de los casos en otros entornos.
- 🐳 Revisa qué contenedores dejas corriendo (`wslc list`).
- 🏭 No trates este repo como solución de producción sin endurecimiento adicional.

---

📖 Ver también: [COMPATIBILITY.md](COMPATIBILITY.md) · [RUNBOOK.md](RUNBOOK.md)
