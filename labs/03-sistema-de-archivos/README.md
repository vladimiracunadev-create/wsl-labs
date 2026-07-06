# 03 · Sistema de archivos 📁

> Interoperabilidad de archivos Windows ↔ WSL y rendimiento.

---

## 📋 Datos del lab

| Campo | Valor |
| --- | --- |
| Tipo | learning |
| Estado | ✅ ready |

---

## 🎯 Objetivo

Entender la diferencia entre el sistema de archivos Linux y el acceso al disco de Windows, y por qué la ubicación de los proyectos afecta al rendimiento.

---

## 📋 Pasos

### 1. Trabajar en la ruta Linux recomendada

```bash
mkdir -p ~/proyectos
cd ~/proyectos
```

### 2. Acceder al disco C de Windows desde WSL

```bash
cd /mnt/c
ls
```

### 3. Abrir una carpeta Linux en el Explorador de Windows

```bash
explorer.exe .
```

---

## ✅ Comprobación

Para proyectos Linux (Node, Python, PHP o bases de datos) trabaja preferentemente en el sistema de archivos nativo:

```bash
~/proyectos
```

Y **no** sobre el disco montado de Windows:

```bash
/mnt/c/Users/...
```

El acceso a `/mnt/c` cruza la frontera Windows↔Linux y es notablemente más lento para operaciones intensivas en I/O.

---

## 🎯 Por qué importa

Colocar el código en el filesystem Linux nativo puede multiplicar la velocidad de instalaciones, builds y arranques de servicios. Es la diferencia entre un entorno de desarrollo fluido y uno frustrante, y explica por qué todos los ejemplos de la suite viven fuera de `/mnt/c`.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
