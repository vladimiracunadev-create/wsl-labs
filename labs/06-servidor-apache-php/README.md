# 06 - Servidor Apache con PHP

## Objetivo

Montar Apache con PHP dentro de WSL.

## Instalación

```bash
sudo apt update
sudo apt install -y apache2 php libapache2-mod-php
```

## Copiar ejemplo

```bash
sudo mkdir -p /var/www/wsl-php
sudo cp ../../examples/apache-php-site/index.php /var/www/wsl-php/index.php
```

## Configurar VirtualHost

```bash
sudo cp apache-wsl-php.conf /etc/apache2/sites-available/wsl-php.conf
sudo a2ensite wsl-php.conf
sudo systemctl reload apache2
```

## Probar

```bash
curl http://localhost:8080
```
