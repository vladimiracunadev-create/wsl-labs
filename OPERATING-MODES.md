# 🎛️ Operating Modes

> **Estado**: Activo
> **Uso recomendado**: Ábrelo si no sabes **cómo** conviene usar `wsl-labs`
> según tu equipo, tu objetivo o tus permisos.

`wsl-labs` puede usarse de varias formas. Todas comparten el mismo catálogo
(`labs.config.json`) y los mismos servicios en `localhost`; cambia **cómo los
operas**.

---

## 🧭 Modo 1 · Solo panel (recomendado)

Levanta el Control Center y opera todo con clics, **sin terminal y sin
contraseñas**.

```powershell
cd C:\dev\wsl-labs
make serve            # o: node dashboard-server/server.js
# → http://localhost:9092
```

| Cuándo usarlo | Ventaja |
| --- | --- |
| Es tu primer contacto con el repo | Flujo **📦 Instalar → ▶ Levantar** de un clic |
| No quieres tocar `sudo` ni scripts | El panel corre como `root` en WSL (estilo Docker) |
| Quieres ver salud y logs de un vistazo | El panel muestra estado, health y logs por servicio |

> [!NOTE]
> El Control Center ejecuta los comandos en WSL vía `wsl.exe -u root`. Por eso
> **nunca pide contraseña**: Windows ya autenticó al usuario. Es el modo con
> menos fricción.

---

## 🖥️ Modo 2 · Por terminal (`make` + passwordless sudo)

Para quien prefiere operar **desde una terminal como su propio usuario**, no vía
el panel. Aquí sí necesitas `sudo` sin contraseña, porque los targets `make up-*`
usan `sudo service …`.

```powershell
wsl bash scripts/install-base.sh            # herramientas base
wsl bash scripts/install-nginx.sh           # instalar el servicio
wsl bash scripts/setup-passwordless-sudo.sh # SOLO para este modo
make up-nginx                               # levantar por terminal
```

| Cuándo usarlo | Consideración |
| --- | --- |
| Prefieres control fino desde la shell | Requiere `setup-passwordless-sudo.sh` |
| Automatizas con scripts propios | Operas como tu usuario, no como root |

> [!IMPORTANT]
> `setup-passwordless-sudo.sh` **no** es necesario para el Modo 1 (el panel usa
> `-u root`). Solo aplica a este flujo de terminal.

---

## 📚 Modo 3 · Solo learning labs

Si solo te interesan los **fundamentos de WSL** (no levantar servicios), usa los
labs de tipo `learning`. No requieren instalar nada ni abrir puertos.

| Lab | Tema |
| --- | --- |
| 01 | Instalación de Ubuntu |
| 02 | Comandos base WSL |
| 03 | Sistema de archivos Windows ↔ WSL |
| 04 | systemd y servicios |
| 10 | Backup export/import de distros |
| 12 | Troubleshooting |

> [!TIP]
> En el panel estos labs aparecen con estado `n/a` 📚 (no tienen puerto ni
> health). Se leen como guía; no hay botón "Levantar".

---

## 🪟 Modo 4 · Con launcher `.exe`

Para usarlo como una app de Windows, sin abrir PowerShell ni recordar comandos.
Descarga el instalador desde
[Releases](https://github.com/vladimiracunadev-create/wsl-labs/releases).

1. Ejecuta `wsl-labs-launcher.exe` (o instálalo con `wsl-labs-setup-X.Y.Z.exe`).
2. El launcher **verifica WSL2** y detecta la distro.
3. Arranca el Control Center en segundo plano.
4. Hace polling a `/api/overview` y **abre el navegador** en `:9092`.

| Cuándo usarlo | Ventaja |
| --- | --- |
| Quieres una experiencia "doble clic" | No tocas la terminal |
| Demo en una máquina limpia | El launcher orquesta todo el arranque |

> [!NOTE]
> Puedes cerrar la ventana del launcher: el Control Center sigue corriendo en
> segundo plano. A partir de ahí operas como en el **Modo 1**.

---

## 🧭 Recomendación

1. Empieza por el **Modo 1 (solo panel)**: es el de menor fricción.
2. Usa el **Modo 4 (launcher)** si quieres una app Windows para demos.
3. Recurre al **Modo 2 (terminal)** solo si necesitas control fino como tu usuario.
4. El **Modo 3 (learning)** es transversal: puedes leer esas guías en cualquier momento.

---

📖 Ver también: [RUNBOOK.md](RUNBOOK.md) · [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) · [FAQ.md](FAQ.md) · [GLOSSARY.md](GLOSSARY.md)
