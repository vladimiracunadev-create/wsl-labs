---
name: Nuevo laboratorio
about: Proponer un nuevo lab para wsl-labs
title: "[Lab]: "
labels: [enhancement, new-lab]
---

## Nombre del lab

Formato `NN-nombre-en-kebab-case` (ej. `13-ssh-server`).

## Descripción

¿Qué se aprende o se monta al completarlo?

## Tipo

- [ ] `learning` (guía conceptual, sin servicio)
- [ ] `service` (levanta un demonio en un puerto)

## Servicio y puerto (si aplica)

| Dato | Valor |
|------|-------|
| Servicio | nginx / apache / … |
| Puerto | 80xx |
| Health | `curl …` |

## Entrada propuesta en `labs.config.json`

```json
{
  "id": "NN",
  "name": "…",
  "path": "labs/NN-…",
  "type": "service",
  "status": "ready",
  "port": 80xx,
  "startCommand": "…",
  "stopCommand": "…",
  "healthProtocol": "http"
}
```

## Contexto

Por qué encaja en la línea de labs.
