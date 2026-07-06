# 05 · Servidor web NGINX 🌐

> Servidor web NGINX sirviendo en `localhost:8080`.

---

## 📋 Datos del lab

| Campo | Valor |
|---|---|
| Tipo | service |
| Estado | ✅ ready |
| Puerto | `8080` |
| URL | [http://localhost:8080](http://localhost:8080) |
| Health | HTTP |

---

## 📦 Instalación y configuración (una vez)

```bash
sudo apt update
sudo apt install -y nginx
```

Crea el sitio de ejemplo y aplica la configuración incluida en este lab
([`nginx-wsl-labs.conf`](nginx-wsl-labs.conf)):

```bash
sudo mkdir -p /var/www/wsl-labs
sudo cp ../../examples/nginx-site/index.html /var/www/wsl-labs/index.html

sudo cp nginx-wsl-labs.conf /etc/nginx/sites-available/wsl-labs
sudo ln -s /etc/nginx/sites-available/wsl-labs /etc/nginx/sites-enabled/wsl-labs
sudo nginx -t
```

---

## 🚀 Ejecutar

```bash
sudo service nginx start
```

---

## ✅ Verificar

```bash
curl http://localhost:8080
```

Luego abre en Windows: [http://localhost:8080](http://localhost:8080)

---

## 🧭 Desde el Control Center

En el dashboard ([http://localhost:9092](http://localhost:9092)) el botón **▶** de este lab
ejecuta el `startCommand` del catálogo (`sudo service nginx start`) sobre WSL, y el estado
de salud se comprueba por HTTP contra el puerto `8080`.

---

## 🛑 Detener

```bash
sudo service nginx stop
```

---

## 🎯 Por qué importa

NGINX es el servidor web más usado para servir estáticos y actuar como reverse proxy. Montarlo en WSL y exponerlo en `localhost:8080` demuestra que un servicio Linux puede integrarse de forma transparente en el flujo de trabajo Windows, y sienta la base del stack combinado del lab 11.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
