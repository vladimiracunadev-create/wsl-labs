# 11 - Mini servidor completo en WSL

## Objetivo

Levantar un entorno básico con:

- Nginx.
- Node.js.
- PostgreSQL.
- Scripts de automatización.

## Instalación base

```bash
../../scripts/install-base.sh
../../scripts/install-nginx.sh
../../scripts/install-node.sh
../../scripts/install-postgresql.sh
```

## Ejecutar API de ejemplo

```bash
cd ../../examples/node-api
npm install
npm start
```

## Probar servicios

```bash
curl http://localhost
curl http://localhost:3000
sudo systemctl status postgresql
```

## Resultado esperado

Un mini entorno de servidor Linux funcionando dentro de WSL.
