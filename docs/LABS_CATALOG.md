# 📚 Catálogo de Labs — WSL Labs

> **Versión**: 0.1.2
> **Estado**: 🟢 Activo
> **Audiencia**: 👥 Todos
> **Objetivo**: Rol de los 12 labs dentro del ecosistema y qué enseña o monta cada uno

---

## 🗺️ Vista general

| Lab | Tipo | Puerto | Rol |
| --- | --- | :---: | --- |
| `01-instalacion-ubuntu` | 📚 learning | — | Instalar WSL 2 + Ubuntu desde cero |
| `02-comandos-base-wsl` | 📚 learning | — | Comandos de `wsl.exe` y del shell Linux |
| `03-sistema-de-archivos` | 📚 learning | — | Interoperabilidad y rendimiento Windows ↔ WSL |
| `04-systemd-servicios` | 📚 learning | — | Habilitar systemd y administrar servicios |
| `05-servidor-web-nginx` | ⚙️ service | `8080` | Servidor web NGINX |
| `06-servidor-apache-php` | ⚙️ service | `8081` | Apache + PHP |
| `07-nodejs-entorno-dev` | ⚙️ service | `8082` | API Node.js de ejemplo |
| `08-python-entorno-dev` | ⚙️ service | `8083` | App Flask de ejemplo |
| `09-postgresql-en-wsl` | ⚙️ service | `5432` | Servidor PostgreSQL |
| `10-backup-export-import` | 📚 learning | — | Exportar/importar/clonar distros WSL |
| `11-mini-servidor-completo` | ⚙️ service | `8090` | Stack combinado (web + db) |
| `12-troubleshooting` | 📚 learning | — | Diagnóstico de problemas comunes |

Dos familias conviven en el catálogo:

- ⚙️ **service** — labs que instalan y publican un servicio real en `localhost`,
  operable desde el Control Center (Instalar → Levantar → Detener → Logs).
- 📚 **learning** — guías de aprendizaje que enseñan a manejar WSL y Linux sin
  dejar un servicio corriendo.

---

## ⚙️ Labs de servicio

Son el núcleo operativo: cada uno corresponde a una tarjeta accionable del panel.

### `05-servidor-web-nginx` · 🌐 `:8080`

El primer servicio real. Enseña a instalar y servir contenido con **NGINX** como
`service` del sistema. Es el caso base para entender el ciclo
Instalar → Levantar → Health-check, y la puerta de entrada al resto de servicios.

### `06-servidor-apache-php` · 🐘 `:8081`

Monta el clásico **Apache + PHP**. Muestra un segundo servidor web conviviendo en
otro puerto y sirviendo contenido dinámico, gestionado también como `service`.

### `07-nodejs-entorno-dev` · 🟢 `:8082`

Levanta una **API Node.js** de ejemplo (usando el módulo `http` nativo, sin
express ni `npm install`). Su valor didáctico está en el modelo de arranque: se
ejecuta como **servicio systemd propio** (`wsl-labs-node`, `enabled`), de modo que
persiste entre reinicios de la instancia WSL.

### `08-python-entorno-dev` · 🐍 `:8083`

Levanta una **app Flask** dentro de un entorno virtual (venv). Al igual que node,
corre como **servicio systemd** (`wsl-labs-flask`, `enabled`). Enseña el patrón
Python de servicio de larga vida en WSL.

### `09-postgresql-en-wsl` · 🗄️ `:5432`

Monta un **servidor PostgreSQL** como `service` del sistema. Es el único servicio
con `healthProtocol: tcp` (no habla HTTP): el panel lo considera sano cuando el
puerto `5432` acepta conexiones. Enseña a exponer una base de datos a Windows.

### `11-mini-servidor-completo` · 🧩 `:8090`

El lab integrador: combina **nginx (con vhost propio) + postgresql** en un único
stack en `:8090`. Su `startCommand` instala el vhost `nginx-mini.conf` en
`sites-available`, lo enlaza en `sites-enabled`, valida con `nginx -t` y recarga.
Demuestra cómo componer varios servicios en una experiencia unificada.

---

## 📚 Labs de aprendizaje

No dejan servicio corriendo; construyen los fundamentos para operar los de servicio.

| Lab | Qué enseña |
| --- | --- |
| `01-instalacion-ubuntu` | Instalar y configurar WSL 2 + Ubuntu desde cero |
| `02-comandos-base-wsl` | Comandos esenciales de `wsl.exe` y del shell Linux |
| `03-sistema-de-archivos` | Interop de archivos Windows ↔ WSL y sus implicaciones de rendimiento |
| `04-systemd-servicios` | Habilitar systemd y administrar servicios — base de los labs 07/08 |
| `10-backup-export-import` | Exportar, importar y clonar distros WSL (backup y portabilidad) |
| `12-troubleshooting` | Diagnóstico y resolución de problemas comunes en WSL |

---

## 🧭 Orden recomendado

| Prioridad | Labs | Motivo |
| ---: | --- | --- |
| 1 | `01`, `02`, `03` | Fundamentos: instalación, comandos, archivos |
| 2 | `04` | systemd — habilita el modelo de servicio persistente |
| 3 | `05`, `09` | Primeros servicios reales (web y base de datos) |
| 4 | `06`, `07`, `08` | Más servidores y entornos de desarrollo |
| 5 | `11` | Stack combinado que integra lo aprendido |
| 6 | `10`, `12` | Backup y troubleshooting cuando ya operas servicios |

---

## 📚 Documentos relacionados

- [LABS_RUNTIME_REFERENCE.md](LABS_RUNTIME_REFERENCE.md)
- [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [../README.md](../README.md)
