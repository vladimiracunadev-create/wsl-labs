# Cheatsheet - systemd

```bash
systemctl status
sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
sudo systemctl disable nginx
journalctl -u nginx
```

Ver proceso principal del sistema:

```bash
ps -p 1 -o comm=
```
