# 10 · Backup, export e import 💾

> Exportar, importar y clonar distros WSL (backup).

---

## 📋 Datos del lab

| Campo | Valor |
| --- | --- |
| Tipo | learning |
| Estado | ✅ ready |

---

### 🗺️ Esquema

```mermaid
flowchart LR
    D["Distro Ubuntu"] -->|"wsl --export"| T["archivo .tar"]
    T -->|"wsl --import"| C["Distro clonada"]
    C --> R["wsl -d Ubuntu-WslLabs"]
```

---

## 🎯 Objetivo

Exportar una distro WSL como archivo `.tar` e importarla como una nueva distro, para respaldar o clonar entornos.

---

## 📋 Pasos

### 1. Listar distros instaladas

```powershell
wsl --list --verbose
```

### 2. Exportar la distro a un `.tar`

```powershell
wsl --export Ubuntu .\backups\ubuntu-wsl-labs.tar
```

### 3. Importar como una nueva distro

```powershell
wsl --import Ubuntu-WslLabs .\distros\Ubuntu-WslLabs .\backups\ubuntu-wsl-labs.tar --version 2
```

### 4. Ejecutar la nueva distro

```powershell
wsl -d Ubuntu-WslLabs
```

### Scripts incluidos

- `scripts/backup-wsl.ps1`
- `scripts/restore-wsl.ps1`

---

## ✅ Comprobación

Tras el import, `wsl --list --verbose` muestra `Ubuntu-WslLabs` junto a la distro original, y puedes entrar a ella con tus datos intactos.

---

## 🎯 Por qué importa

Un `.tar` exportado es un backup portátil y reproducible de todo el entorno: sirve para migrar de máquina, versionar una imagen base o recuperarse de un desastre. Clonar distros también permite experimentar sin miedo, sabiendo que el original queda a salvo.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
