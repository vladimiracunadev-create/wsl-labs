# ❓ FAQ

Preguntas frecuentes sobre `wsl-labs`. Para operar, mira el
[RUNBOOK.md](RUNBOOK.md); para setup, [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 🚪 ¿Cuál es la entrada principal del repo?

El **Control Center**: <http://localhost:9092>. Desde ahí instalas, levantas,
detienes y revisas la salud de cada servicio.

---

## 🔑 ¿El panel me pide contraseña?

**No.** El Control Center ejecuta los comandos dentro de WSL como `root`
(`wsl.exe -u root`), igual que Docker corre privilegiado. Windows ya autenticó
al usuario, así que **no se pide contraseña** para instalar ni operar servicios.

> [!NOTE]
> El `setup-passwordless-sudo.sh` **solo** hace falta si operas por terminal con
> `make up-*` como tu propio usuario (ver [OPERATING-MODES.md](OPERATING-MODES.md),
> Modo 2). Para el panel no es necesario.

---

## 🐳 ¿Necesito Docker?

**No.** `wsl-labs` no usa Docker en absoluto. Los servicios corren **nativos
dentro de WSL2** (nginx, apache, postgresql como servicios de la distro; node y
flask como unidades systemd). El parecido con Docker es solo la **experiencia**:
un panel que instala y levanta con un clic.

---

## 🧩 ¿Funciona sin systemd?

Depende del servicio:

| Servicio | Mecanismo | ¿Necesita systemd? |
| --- | --- | --- |
| nginx, apache, postgresql | `sudo service …` | No |
| node (`wsl-labs-node`), flask (`wsl-labs-flask`) | unidad systemd | **Sí** |

> [!TIP]
> Habilita systemd en `/etc/wsl.conf` (`[boot]` → `systemd=true`) y reinicia con
> `wsl --shutdown`. El **lab 04** te guía en esto.

---

## 😴 ¿Se apaga WSL y matan los servicios?

WSL apaga la instancia cuando queda inactiva, lo que tumbaría los servicios.
Para evitarlo, mientras el Control Center corre mantiene un **keepalive** que
conserva viva la instancia WSL (como Docker Desktop con su VM). Así los
servicios siguen accesibles desde `localhost`.

---

## 🌐 ¿Puedo exponerlo a la red?

**No por diseño.** El Control Center escucha **solo en `127.0.0.1:9092`**. Dado
que corre comandos en WSL como `root` sin contraseña, exponerlo sería un riesgo
de seguridad. Mantenlo en `localhost` (ver [SECURITY.md](SECURITY.md)).

---

## 🆘 ¿Qué hago si `:9092` no abre?

```powershell
wsl --status                     # ¿WSL 2 activo?
node --version                   # ¿Node ≥ 18 en Windows?
node dashboard-server/server.js  # arranca el panel manualmente
```

Si sigue sin abrir, revisa el **lab 12 (troubleshooting)** y
[SUPPORT.md](SUPPORT.md).

---

## 📦 ¿Cómo instalo un servicio?

Desde el panel: botón **📦 Instalar** en la tarjeta del servicio (corre su
`install-*.sh` como root). Los instaladores son **idempotentes**: puedes
re-instalar sin miedo. Luego pulsa **▶ Levantar**.

---

## 🪟 ¿Hay un `.exe`?

Sí, el **launcher de Windows**. Descárgalo desde
[Releases](https://github.com/vladimiracunadev-create/wsl-labs/releases):
verifica WSL2, arranca el Control Center y abre el navegador por ti.

> [!NOTE]
> El instalador **no está firmado** en v0.x. Si SmartScreen avisa, elige
> *Más información → Ejecutar de todas formas*.

---

## 🔀 ¿En qué se diferencia de `docker-labs`?

Comparten arquitectura (Control Center web + launcher Windows + servicios en
`localhost`), pero la capa técnica es distinta:

| | `wsl-labs` | `docker-labs` |
| --- | --- | --- |
| Motor | 🐧 **WSL2** (Linux nativo en Windows) | 🐳 **Docker** (contenedores) |
| Servicios | systemd / `service` en la distro | contenedores + Compose |
| Panel | Node.js `:9092` | dashboard dockerizado |
| Aislamiento | Una distro compartida | Un contenedor por servicio |

> [!NOTE]
> `wsl-labs`, [`docker-labs`](https://github.com/vladimiracunadev-create/docker-labs)
> y [`unikernel-labs`](https://github.com/vladimiracunadev-create/unikernel-labs)
> son una **línea** de laboratorios sobre tecnologías para montar sistemas.

---

## ☁️ ¿Sirve para cloud o Kubernetes?

**No.** `wsl-labs` es **local only**: montar y aprender servicios Linux en tu
Windows. No cubre despliegues cloud ni orquestación con k8s.

---

📖 Ver también: [OPERATING-MODES.md](OPERATING-MODES.md) · [GLOSSARY.md](GLOSSARY.md) · [SUPPORT.md](SUPPORT.md) · [RUNBOOK.md](RUNBOOK.md)
