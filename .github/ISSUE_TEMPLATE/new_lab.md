---
name: Nuevo caso de contenedor
about: Proponer un nuevo caso para el catálogo de contenedores
title: "[Caso]: "
labels: [enhancement, new-case]
---

## Nombre del caso

Formato `NN-nombre-en-kebab-case` (ej. `13-mysql-api`) → carpeta `containers/NN-nombre/`.

## Qué monta

¿Qué imagen(es) y para qué? ¿Un solo contenedor o un stack (app + base de datos)?

## Categoría

- [ ] `starter` (un contenedor de aplicación)
- [ ] `platform` (app + backend por una red `wslc`)
- [ ] `infra` (imagen oficial de infraestructura)

## Imágenes y puertos

| Dato | Valor |
|------|-------|
| Imagen(es) | `node:20-alpine`, … |
| ¿Custom? | sí (con `Dockerfile`) / no (imagen pública) |
| Puerto host | 81xx |
| Red (si multi) | `wslc-…-net` |
| Health | `curl http://localhost:81xx` |

## Entrada propuesta en `containers/containers.config.json`

```json
{
  "id": "NN",
  "name": "…",
  "title": "…",
  "category": "starter",
  "port": 81xx,
  "url": "http://localhost:81xx",
  "healthProtocol": "http",
  "build": [{ "image": "wsl-labs/…:latest", "context": "containers/NN-…" }],
  "containers": [{ "name": "wslc-…", "image": "wsl-labs/…:latest", "ports": ["81xx:80"] }]
}
```

## Contexto

Por qué encaja en la plataforma (equivalencia con docker-labs, si aplica).
