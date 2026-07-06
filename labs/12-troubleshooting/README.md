# 12 - Troubleshooting WSL

## WSL no inicia

Desde PowerShell:

```powershell
wsl --shutdown
wsl --status
```

## Ver distros instaladas

```powershell
wsl --list --verbose
```

## Actualizar WSL

```powershell
wsl --update
```

## Problemas con servicios

Dentro de Ubuntu:

```bash
ps -p 1 -o comm=
systemctl status
```

## Problemas de puertos

```bash
ss -tulpn
```

## Ver IP de WSL

```bash
hostname -I
ip addr
```
