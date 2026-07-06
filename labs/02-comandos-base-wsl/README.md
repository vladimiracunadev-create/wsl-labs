# 02 - Comandos base de WSL

## Objetivo

Practicar comandos de administración básica de WSL desde PowerShell.

## Listar distros

```powershell
wsl --list --verbose
```

## Ejecutar una distro

```powershell
wsl -d Ubuntu
```

## Detener WSL

```powershell
wsl --shutdown
```

## Ejecutar comando Linux desde PowerShell

```powershell
wsl -d Ubuntu -- uname -a
```

## Ver ruta actual de Linux desde Windows

Dentro de Ubuntu:

```bash
explorer.exe .
```
