# 10 - Backup, exportación e importación de distros WSL

## Objetivo

Exportar una distro WSL como archivo `.tar` e importarla como una nueva distro.

## Listar distros

```powershell
wsl --list --verbose
```

## Exportar distro

```powershell
wsl --export Ubuntu .\backups\ubuntu-wsl-labs.tar
```

## Importar como nueva distro

```powershell
wsl --import Ubuntu-WslLabs .\distros\Ubuntu-WslLabs .\backups\ubuntu-wsl-labs.tar --version 2
```

## Ejecutar la nueva distro

```powershell
wsl -d Ubuntu-WslLabs
```

## Scripts incluidos

- `scripts/backup-wsl.ps1`
- `scripts/restore-wsl.ps1`
