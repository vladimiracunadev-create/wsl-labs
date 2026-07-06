# wsl-labs

Laboratorios prácticos para aprender a montar, administrar y automatizar sistemas Linux usando **Windows Subsystem for Linux**.

Este repositorio forma parte de una línea de laboratorios orientados a tecnologías para montar sistemas:

- **docker-labs**: sistemas basados en contenedores.
- **unikernel-labs**: sistemas mínimos y especializados.
- **wsl-labs**: sistemas Linux integrados con Windows mediante WSL.

## Objetivo

Explorar WSL como plataforma para levantar entornos Linux, servicios, servidores web, bases de datos, herramientas de desarrollo, automatización y pruebas locales.

La idea no es reemplazar Docker, sino estudiar WSL como otra tecnología útil para crear entornos de trabajo, pruebas y administración de sistemas desde Windows.

## Contenidos

- Instalación y configuración de WSL 2.
- Administración de distribuciones Linux.
- Comandos base de WSL y Linux.
- Uso de `systemd` y servicios Linux.
- Servidores web con Nginx y Apache.
- Entornos Node.js, Python y PHP.
- Bases de datos PostgreSQL y MySQL/MariaDB.
- Automatización con Bash y PowerShell.
- Backup, exportación, importación y clonación de distros WSL.
- Comparación práctica entre WSL, Docker y máquinas virtuales.

## Requisitos

- Windows 10 o Windows 11.
- WSL 2.
- Una distribución Linux compatible, por ejemplo Ubuntu o Debian.
- Git.
- PowerShell o Windows Terminal.

## Estructura

```text
wsl-labs/
├── docs/          # Documentación conceptual y guías base
├── labs/          # Laboratorios prácticos paso a paso
├── scripts/       # Scripts Bash y PowerShell
├── examples/      # Ejemplos mínimos de aplicaciones/servicios
└── cheatsheets/   # Resúmenes rápidos de comandos
```

## Ruta sugerida de aprendizaje

1. `docs/00-que-es-wsl.md`
2. `labs/01-instalacion-ubuntu/`
3. `labs/02-comandos-base-wsl/`
4. `labs/03-sistema-de-archivos/`
5. `labs/04-systemd-servicios/`
6. `labs/05-servidor-web-nginx/`
7. `labs/06-servidor-apache-php/`
8. `labs/07-nodejs-entorno-dev/`
9. `labs/08-python-entorno-dev/`
10. `labs/09-postgresql-en-wsl/`
11. `labs/10-backup-export-import/`
12. `labs/11-mini-servidor-completo/`

## Comandos iniciales

Desde PowerShell:

```powershell
wsl --list --verbose
wsl --status
```

Desde Ubuntu/WSL:

```bash
sudo apt update
sudo apt upgrade -y
uname -a
lsb_release -a
```

## Estado del proyecto

Repositorio inicial en construcción.

## Licencia

MIT.
