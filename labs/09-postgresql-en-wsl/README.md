# 09 · PostgreSQL en WSL 🗄️

> Servidor PostgreSQL en `localhost:5432`.

---

## 📋 Datos del lab

| Campo | Valor |
|---|---|
| Tipo | service |
| Estado | ✅ ready |
| Puerto | `5432` |
| URL | `postgres://localhost:5432` |
| Health | TCP |

---

## 📦 Instalación y base de datos (una vez)

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

Crea el usuario y la base de laboratorio:

```bash
sudo -u postgres psql
```

Dentro de la consola de PostgreSQL:

```sql
CREATE USER wsl_user WITH PASSWORD 'wsl_pass';
CREATE DATABASE wsl_labs OWNER wsl_user;
\q
```

---

## 🚀 Ejecutar

> [!IMPORTANT]
> Antes de arrancar por primera vez, ejecuta desde la raíz del repo el
> install-script (instala PostgreSQL y asegura que escucha en `localhost:5432`)
> y, para controlarlo con el botón **▶** del dashboard, habilita `sudo` sin contraseña:
>
> ```bash
> wsl bash scripts/install-postgresql.sh
> wsl bash scripts/setup-passwordless-sudo.sh   # solo una vez
> ```

```bash
sudo service postgresql start
```

---

## ✅ Verificar

El health del catálogo es **TCP** contra el puerto `5432`. Comprueba la escucha y la conexión:

```bash
ss -tulpn | grep 5432
psql -h localhost -U wsl_user -d wsl_labs
```

---

## 🧭 Desde el Control Center

En el dashboard ([http://localhost:9092](http://localhost:9092)) el botón **▶** de este lab
ejecuta el `startCommand` del catálogo (`sudo service postgresql start`) sobre WSL, y el estado
de salud se comprueba por TCP contra el puerto `5432`.

---

## 🛑 Detener

```bash
sudo service postgresql stop
```

---

## 🎯 Por qué importa

PostgreSQL es la base de datos relacional de referencia. Tenerla corriendo en WSL y accesible en `localhost:5432` permite desarrollar contra un motor real sin contenedores ni VMs, y aporta la capa de persistencia del stack completo del lab 11.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
