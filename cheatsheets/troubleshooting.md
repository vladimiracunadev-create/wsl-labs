# Cheatsheet - Troubleshooting

## Reiniciar WSL

Desde PowerShell:

```powershell
wsl --shutdown
```

Luego vuelve a entrar:

```powershell
wsl -d Ubuntu
```

## Servicio no inicia

```bash
sudo systemctl status nombre-servicio
journalctl -u nombre-servicio
```

## Puerto ocupado

```bash
ss -tulpn
```

## Actualizar sistema

```bash
sudo apt update
sudo apt upgrade -y
```
