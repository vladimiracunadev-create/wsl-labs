# 04 - Buenas prácticas con WSL

## 1. Guarda tus proyectos dentro de Linux

Preferir:

```bash
~/proyectos
```

Evitar para proyectos Linux pesados:

```bash
/mnt/c/Users/usuario/proyecto
```

## 2. Mantén WSL actualizado

Desde PowerShell:

```powershell
wsl --update
```

Dentro de Ubuntu:

```bash
sudo apt update
sudo apt upgrade -y
```

## 3. No borres `docker-desktop`

Si usas Docker Desktop, no elimines manualmente:

```text
docker-desktop
docker-desktop-data
```

Son parte del funcionamiento interno de Docker Desktop.

## 4. Usa scripts repetibles

Todo laboratorio debería poder repetirse con comandos claros o scripts.

## 5. Documenta errores

Cada lab puede incluir una sección de troubleshooting.
