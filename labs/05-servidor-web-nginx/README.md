# 05 - Servidor web con Nginx

## Objetivo

Montar un servidor web Nginx dentro de WSL.

## Instalación

```bash
sudo apt update
sudo apt install -y nginx
```

## Crear sitio básico

```bash
sudo mkdir -p /var/www/wsl-labs
sudo cp ../../examples/nginx-site/index.html /var/www/wsl-labs/index.html
```

## Configuración de sitio

```bash
sudo cp nginx-wsl-labs.conf /etc/nginx/sites-available/wsl-labs
sudo ln -s /etc/nginx/sites-available/wsl-labs /etc/nginx/sites-enabled/wsl-labs
sudo nginx -t
sudo systemctl restart nginx
```

## Probar

```bash
curl http://localhost
```

Luego abre en Windows:

```text
http://localhost
```
