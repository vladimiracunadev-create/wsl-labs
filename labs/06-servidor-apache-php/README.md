# 06 · Servidor Apache + PHP 🐘

> Apache + PHP sirviendo en `localhost:8081`.

---

## 📋 Datos del lab

| Campo | Valor |
|---|---|
| Tipo | service |
| Estado | ✅ ready |
| Puerto | `8081` |
| URL | [http://localhost:8081](http://localhost:8081) |
| Health | HTTP |

---

## 📦 Instalación y configuración (una vez)

```bash
sudo apt update
sudo apt install -y apache2 php libapache2-mod-php
```

Copia el ejemplo PHP y activa el VirtualHost incluido en este lab
([`apache-wsl-php.conf`](apache-wsl-php.conf)):

```bash
sudo mkdir -p /var/www/wsl-php
sudo cp ../../examples/apache-php-site/index.php /var/www/wsl-php/index.php

sudo cp apache-wsl-php.conf /etc/apache2/sites-available/wsl-php.conf
sudo a2ensite wsl-php.conf
```

---

## 🚀 Ejecutar

```bash
sudo service apache2 start
```

---

## ✅ Verificar

```bash
curl http://localhost:8081
```

Luego abre en Windows: [http://localhost:8081](http://localhost:8081)

---

## 🧭 Desde el Control Center

En el dashboard ([http://localhost:9092](http://localhost:9092)) el botón **▶** de este lab
ejecuta el `startCommand` del catálogo (`sudo service apache2 start`) sobre WSL, y el estado
de salud se comprueba por HTTP contra el puerto `8081`.

---

## 🛑 Detener

```bash
sudo service apache2 stop
```

---

## 🎯 Por qué importa

Apache con `mod_php` sigue siendo la combinación clásica para servir aplicaciones PHP. Levantarlo junto a NGINX (lab 05) sin conflicto de puertos demuestra que WSL puede alojar varios servidores web simultáneos, cada uno en su propio puerto de `localhost`.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
