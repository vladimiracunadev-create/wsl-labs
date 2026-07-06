# 08 - Entorno Python en WSL

## Objetivo

Crear un entorno Python con virtualenv y Flask.

## Instalación

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
```

## Crear entorno

```bash
cd ../../examples/python-flask
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Probar

```bash
curl http://localhost:5000
```
