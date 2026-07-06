# 02 - Comandos básicos

## Desde PowerShell

```powershell
wsl --list --verbose
wsl --status
wsl --shutdown
wsl -d Ubuntu
```

## Dentro de WSL

```bash
pwd
ls
cd
mkdir
rm
cp
mv
cat
nano
chmod
chown
```

## Actualizar paquetes

```bash
sudo apt update
sudo apt upgrade -y
```

## Instalar herramientas base

```bash
sudo apt install -y git curl wget unzip build-essential ca-certificates
```

## Ver información del sistema

```bash
uname -a
lsb_release -a
whoami
id
ip addr
```
