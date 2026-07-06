# 04 - systemd y servicios Linux

## Objetivo

Usar `systemctl` para administrar servicios dentro de WSL.

## Revisar estado de systemd

```bash
ps -p 1 -o comm=
```

Debe mostrar:

```text
systemd
```

## Instalar servicio de ejemplo

```bash
sudo apt update
sudo apt install -y nginx
```

## Administrar servicio

```bash
sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Validación

```bash
curl http://localhost
```
