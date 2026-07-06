# 01 - Instalación de WSL

## Ver estado de WSL

Desde PowerShell:

```powershell
wsl --status
wsl --list --verbose
```

## Instalar WSL

```powershell
wsl --install
```

## Instalar una distro específica

```powershell
wsl --install -d Ubuntu
```

## Listar distribuciones disponibles

```powershell
wsl --list --online
```

## Definir WSL 2 como versión por defecto

```powershell
wsl --set-default-version 2
```

## Entrar a Ubuntu

```powershell
wsl -d Ubuntu
```

## Apagar WSL

```powershell
wsl --shutdown
```
