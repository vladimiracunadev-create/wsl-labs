# 01 - Instalación de Ubuntu en WSL

## Objetivo

Instalar Ubuntu sobre WSL 2 y dejarlo listo para laboratorios posteriores.

## Comandos desde PowerShell

```powershell
wsl --status
wsl --list --online
wsl --install -d Ubuntu
wsl --list --verbose
```

## Entrar a Ubuntu

```powershell
wsl -d Ubuntu
```

## Primeros comandos dentro de Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl wget unzip build-essential ca-certificates
```

## Validación

```bash
lsb_release -a
uname -a
whoami
```

## Resultado esperado

Una distribución Ubuntu funcionando sobre WSL 2.
