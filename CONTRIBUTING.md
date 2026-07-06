# 🤝 CONTRIBUTING — WSL Control Center v1

> Gracias por tu interés en contribuir. Este documento resume cómo añadir labs,
> tocar el Control Center o la documentación sin romper la coherencia del
> proyecto. Consulta el [RUNBOOK.md](RUNBOOK.md) para los comandos operativos.

---

## 🗂️ Tipos de contribución

| Tipo | Descripción | Archivos clave |
|---|---|---|
| 🧪 Nuevo lab | Nuevo servicio o guía sobre WSL2 | `labs/NN-nombre/`, `labs.config.json` |
| 🖥️ Fix del Control Center | Cambios en la API o UI web | `dashboard-server/`, `dashboard.js`, `index.html` |
| 🚀 Fix del launcher | Cambios en la app Go | `launcher/windows/main.go` |
| 📖 Mejora de docs | README, runbooks, guías Windows/WSL | `docs/`, raíz |
| ⚙️ CI/CD | Cambios en workflows y verificadores | `.github/workflows/` |

---

## 📇 Regla principal: un solo catálogo fuente

La fuente única de verdad es **`labs.config.json`** en la raíz del repo.

El Control Center y el launcher **leen ese archivo directamente**: puertos,
comandos, health y descripciones salen de ahí. No dupliques esta información en
otros JSON.

> [!IMPORTANT]
> Si cambias un puerto, comando o estado, hazlo en `labs.config.json` y déjalo
> reflejado en el README del lab. No hardcodees puertos en el dashboard.

---

## 🧪 Añadir un lab

### 1 · Naming y estructura

Usa el formato `NN-nombre-kebab`:

```text
labs/13-servidor-ssh/
└── README.md
```

- `NN` — número de dos dígitos, secuencial
- `nombre-kebab` — descriptivo, en minúsculas y guiones

### 2 · Registro en `labs.config.json`

Añade una entrada al array `labs`. Para un **lab de servicio**:

```json
{
  "id": "13",
  "name": "servidor-ssh",
  "path": "labs/13-servidor-ssh",
  "type": "service",
  "status": "ready",
  "description": "Servidor SSH sirviendo en localhost:2222.",
  "url": "ssh://localhost:2222",
  "port": 2222,
  "startCommand": "sudo service ssh start",
  "stopCommand": "sudo service ssh stop",
  "logsCommand": "sudo tail -n 50 /var/log/auth.log 2>/dev/null || true",
  "healthProtocol": "tcp"
}
```

Para un **lab de aprendizaje** (sin servicio):

```json
{
  "id": "14",
  "name": "cron-y-tareas",
  "path": "labs/14-cron-y-tareas",
  "type": "learning",
  "status": "ready",
  "description": "Programar tareas con cron dentro de WSL.",
  "healthProtocol": null
}
```

| Campo | Uso |
|---|---|
| `type` | `service` (tiene puerto) o `learning` (solo guía) |
| `healthProtocol` | `http`, `tcp` o `null` |
| `startCommand` | Comando que se ejecuta con `wsl.exe -d <distro> -- bash -lc "..."` |
| `$WSL_LABS_ROOT` | Disponible en los comandos; apunta a la raíz del repo en formato WSL |

### 3 · README del lab (plantilla)

Cada lab sigue la misma plantilla homogénea:

```markdown
# 🧪 NN · Nombre del lab

| Dato | Valor |
|---|---|
| Tipo | ⚙️ service / 📚 learning |
| Puerto | 2222 (o —) |
| Estado | ✅ ready |

## 🚀 Ejecutar (WSL)

​```bash
sudo service ssh start
​```

## ✅ Verificar

​```bash
ss -tulpn | grep 2222
​```

## 🧭 Desde el Control Center

Botón **Levantar** en la tarjeta del lab, o `POST /api/wsl/start { "id": "NN" }`.

## 🎯 Por qué importa

Breve explicación del concepto de WSL2 que enseña este lab.
```

### 4 · Validación

```powershell
# desde la raíz del repo
node dashboard-server/verify-localhost.js
# o
make test-dashboard
```

Luego levanta el servicio y comprueba `localhost`:

```powershell
Invoke-RestMethod -Method Post -Headers @{ 'Content-Type'='application/json' } `
  -Body '{ "id": "13" }' http://localhost:9092/api/wsl/start
Invoke-RestMethod http://localhost:9092/api/health/13
```

---

## 🚀 Launcher Windows (Go)

El launcher está en `launcher/windows/main.go` y solo usa la biblioteca estándar
de Go (sin dependencias externas).

### Requisitos de desarrollo

- **Go 1.21+**
- WSL2 con Ubuntu o Debian
- Node.js 18+ en el PATH de Windows

### Compilar

```powershell
cd launcher\windows
go build -ldflags "-X main.launcherVersion=0.1.0" -o wsl-labs-launcher.exe .
```

---

## 📝 Convenciones

- Nombres de lab en formato `NN-kebab-case`
- Puertos **fijos y previsibles** (ver [RUNBOOK.md](RUNBOOK.md))
- Si un lab expone un servicio, documenta su URL/puerto en su `README.md`
- No hardcodees puertos ni comandos fuera de `labs.config.json`
- Español en toda la documentación, con emoji por sección y bloques `> [!NOTE]`

---

## 🌿 Flujo git sugerido

1. 🌿 Crea una rama descriptiva
2. ✏️ Haz cambios pequeños y verificables
3. 📖 Actualiza docs si cambias flujo operativo
4. ✅ Ejecuta las validaciones que apliquen
5. 🚀 Abre el PR con contexto claro

### Ejemplos de commits

```text
feat: add ssh service lab (13) to catalog
fix: harden localhost dashboard static path handling
docs: align WSL setup with install-base script
test: add verify-localhost edge case coverage
```

---

📖 Ver también: [RUNBOOK.md](RUNBOOK.md) · [FILE_ARCHITECTURE.md](FILE_ARCHITECTURE.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
