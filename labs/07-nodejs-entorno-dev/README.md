# 07 - Entorno Node.js en WSL

## Objetivo

Crear un entorno Node.js simple dentro de WSL.

## Instalación base

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v
```

## Ejecutar ejemplo

```bash
cd ../../examples/node-api
npm install
npm start
```

## Probar

```bash
curl http://localhost:3000
```
