# 🎛️ Operating Modes

> **Estado**: Activo
> **Uso recomendado**: Ábrelo si no sabes **cómo** conviene usar `wsl-labs`
> según tu objetivo o tu comodidad con la terminal.

`wsl-labs` puede usarse de varias formas. Todas comparten el mismo catálogo
(`containers/containers.config.json`), el mismo motor (`wslc`) y los mismos
contenedores en `localhost`; cambia **cómo los operas**.

---

## 🧭 Modo 1 · Solo panel (recomendado)

Levanta el panel y opera todo con clics, **sin terminal y sin contraseñas**.

```powershell
cd C:\dev\wsl-labs
make serve            # o: node dashboard-server/server.js
# → http://localhost:9092
```

| Cuándo usarlo | Ventaja |
| --- | --- |
| Es tu primer contacto con el repo | Flujo **🔨 Construir → ▶ Levantar** de un clic |
| No quieres tocar `wslc` a mano | El panel invoca `wslc.exe` por ti |
| Quieres ver estado y logs de un vistazo | El panel muestra estado, health y logs por caso |

> [!NOTE]
> El panel ejecuta `wslc.exe` en **Windows** (Windows ya autenticó al usuario).
> Por eso **nunca pide contraseña**: no usa sudo ni `wsl -u root`. Es el modo con
> menos fricción.

---

## 🖥️ Modo 2 · Por terminal (`wslc` directo / `make build-*`)

Para quien prefiere operar **desde una terminal**, sin el panel. Usas `wslc`
directamente o los targets `make build-*`.

```powershell
# Construir la imagen de un caso
make build-node
# o directamente con wslc:
& "C:\Program Files\WSL\wslc.exe" build -t wsl-labs/node-api:latest containers/01-node-api

# Levantar el contenedor
& "C:\Program Files\WSL\wslc.exe" run -d --name wslc-node-api -p 8101:3000 wsl-labs/node-api:latest

# Ver / bajar
& "C:\Program Files\WSL\wslc.exe" logs wslc-node-api
& "C:\Program Files\WSL\wslc.exe" stop wslc-node-api
& "C:\Program Files\WSL\wslc.exe" rm wslc-node-api
```

| Cuándo usarlo | Consideración |
| --- | --- |
| Prefieres control fino desde la shell | Tú gestionas red/orden de los contenedores |
| Automatizas con scripts propios | Los comandos exactos están en el README de cada caso |

> [!TIP]
> `make build-<caso>` cubre los casos con imagen propia (node, python, go, nginx,
> redis, postgres, php, multi). Los casos de imagen oficial se levantan
> directamente con `wslc run` (o desde el panel).

---

## 🪟 Modo 3 · Con launcher `.exe`

Para usarlo como una app de Windows, sin abrir PowerShell ni recordar comandos.
Descarga el instalador desde
[Releases](https://github.com/vladimiracunadev-create/wsl-labs/releases).

1. Ejecuta `wsl-labs-launcher.exe` (o instálalo con `wsl-labs-setup-X.Y.Z.exe`).
2. El launcher **verifica WSL** y localiza `wslc`.
3. Arranca el panel en segundo plano.
4. Hace polling a `/api/wslc/overview` y **abre el navegador** en `:9092`.

| Cuándo usarlo | Ventaja |
| --- | --- |
| Quieres una experiencia "doble clic" | No tocas la terminal |
| Demo en una máquina limpia | El launcher orquesta todo el arranque |

> [!NOTE]
> Puedes cerrar la ventana del launcher: el panel sigue corriendo en segundo
> plano. A partir de ahí operas como en el **Modo 1**.

---

## 📚 WSL como documentación de contexto

Si quieres entender **los fundamentos de WSL** (la base sobre la que corre
`wslc`), las guías `docs/00-05`, la
[historia y referencia](docs/wsl-historia-y-referencia.md) y los
[cheatsheets](cheatsheets/) están ahí para leer. No forman parte del flujo
operativo (no levantan contenedores); son **contexto**.

---

## 🧭 Recomendación

1. Empieza por el **Modo 1 (solo panel)**: es el de menor fricción.
2. Usa el **Modo 3 (launcher)** si quieres una app Windows para demos.
3. Recurre al **Modo 2 (terminal)** solo si necesitas control fino con `wslc`.

---

📖 Ver también: [RUNBOOK.md](RUNBOOK.md) · [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) · [FAQ.md](FAQ.md) · [GLOSSARY.md](GLOSSARY.md)
