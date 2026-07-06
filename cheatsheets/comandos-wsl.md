# Cheatsheet - Comandos WSL

## Listar distros

```powershell
wsl --list --verbose
```

## Instalar distro

```powershell
wsl --install -d Ubuntu
```

## Entrar a una distro

```powershell
wsl -d Ubuntu
```

## Apagar WSL

```powershell
wsl --shutdown
```

## Exportar distro

```powershell
wsl --export Ubuntu .\ubuntu-backup.tar
```

## Importar distro

```powershell
wsl --import Ubuntu-Lab .\Ubuntu-Lab .\ubuntu-backup.tar --version 2
```

## Eliminar distro

```powershell
wsl --unregister NombreDistro
```

> Cuidado: `--unregister` elimina la distro y sus datos.
