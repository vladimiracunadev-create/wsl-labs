# 02 · Comandos base de WSL 🐧

> Comandos base de `wsl.exe` y del shell Linux.

---

## 📋 Datos del lab

| Campo | Valor |
| --- | --- |
| Tipo | learning |
| Estado | ✅ ready |

---

## 🎯 Objetivo

Practicar los comandos de administración básica de WSL desde PowerShell y aprender a saltar entre Windows y el shell Linux.

---

## 📋 Pasos

### 1. Listar distros instaladas

```powershell
wsl --list --verbose
```

### 2. Ejecutar una distro

```powershell
wsl -d Ubuntu
```

### 3. Detener WSL por completo

```powershell
wsl --shutdown
```

### 4. Ejecutar un comando Linux desde PowerShell

```powershell
wsl -d Ubuntu -- uname -a
```

### 5. Abrir la ruta actual de Linux en el Explorador de Windows

Dentro de Ubuntu:

```bash
explorer.exe .
```

---

## ✅ Comprobación

`wsl --list --verbose` muestra Ubuntu en estado `Running` tras entrar, y `wsl --shutdown` la deja en `Stopped`.

---

## 🎯 Por qué importa

Dominar `wsl.exe` es lo que convierte a WSL en una herramienta usable a diario: arrancar, detener y ejecutar comandos puntuales sin abrir una terminal completa es la base para automatizar servicios desde Windows, justo lo que hace el Control Center.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
