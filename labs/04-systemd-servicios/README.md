# 04 · systemd y servicios ⚙️

> Habilitar systemd y administrar servicios Linux en WSL.

---

## 📋 Datos del lab

| Campo | Valor |
| --- | --- |
| Tipo | learning |
| Estado | ✅ ready |

---

## 🎯 Objetivo

Usar `systemctl` para administrar servicios Linux reales dentro de WSL, con systemd como PID 1.

---

## 📋 Pasos

### 1. Verificar que systemd es el proceso init

```bash
ps -p 1 -o comm=
```

Debe mostrar:

```text
systemd
```

### 2. Instalar un servicio de ejemplo

```bash
sudo apt update
sudo apt install -y nginx
```

### 3. Administrar el servicio con systemctl

```bash
sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## ✅ Comprobación

```bash
curl http://localhost
```

Si systemd está activo y el servicio arrancó, obtendrás la página por defecto de nginx.

---

## 🎯 Por qué importa

Con systemd habilitado, WSL deja de ser un shell aislado y se comporta como un servidor Linux de verdad: los servicios arrancan, se detienen y se habilitan al inicio igual que en producción. Es la base sobre la que se apoyan los labs de servicio (nginx, Apache, PostgreSQL) de esta suite.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
