# 09 - PostgreSQL en WSL

## Objetivo

Instalar PostgreSQL dentro de WSL y crear una base de datos de laboratorio.

## Instalación

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

## Estado del servicio

```bash
sudo systemctl status postgresql
```

## Crear usuario y base

```bash
sudo -u postgres psql
```

Dentro de PostgreSQL:

```sql
CREATE USER wsl_user WITH PASSWORD 'wsl_pass';
CREATE DATABASE wsl_labs OWNER wsl_user;
\q
```

## Probar conexión

```bash
psql -h localhost -U wsl_user -d wsl_labs
```
