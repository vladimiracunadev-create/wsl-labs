# 11 · Elasticsearch 🔎

Motor de búsqueda Elasticsearch 8 en modo nodo único con seguridad desactivada. Imagen pública, sin build.

## 📋 Datos del caso

| Categoría | Valor |
|---|---|
| Categoría | `infra` |
| Imagen | `elasticsearch:8.11.0` (pública, sin Dockerfile) |
| Puerto host | `8113` → contenedor `9200` |
| Red | — (contenedor único) |
| Health | `GET /` → HTTP 200 (info del clúster) |

## 🚀 Construir y levantar

No requiere build: la imagen es pública.

```bash
wslc run -d --name wslc-elasticsearch \
  -e discovery.type=single-node \
  -e xpack.security.enabled=false \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -p 8113:9200 elasticsearch:8.11.0
```

> [!TIP]
> `discovery.type=single-node` evita formar clúster, `xpack.security.enabled=false` deja la API abierta (solo para laboratorio) y `ES_JAVA_OPTS` limita la JVM a 512 MB para no saturar la memoria.

## ✅ Verificar

```bash
curl http://localhost:8113
```

> [!NOTE]
> Devuelve el JSON de información del nodo (nombre, versión, `tagline`) con HTTP 200. Elasticsearch puede tardar unos segundos en aceptar conexiones tras arrancar.

## 🧭 Desde el panel

En [http://localhost:9092](http://localhost:9092) busca la tarjeta **11 · Elasticsearch** y usa los botones **Levantar**, **Bajar** y **Logs** (no hay **Construir**: la imagen es pública).

## 🛑 Bajar

```bash
wslc stop wslc-elasticsearch
wslc rm wslc-elasticsearch
```

## 🎯 Equivale a docker-labs

Porta el caso `11-elasticsearch` de docker-labs (motor de búsqueda Elasticsearch), ahora sobre el motor `wslc`.

## 🗺️ Esquema

```mermaid
flowchart LR
  W[Windows / navegador] --> P[Panel Node.js :9092]
  P --> E[wslc]
  E --> C["wslc-elasticsearch<br/>elasticsearch:8.11.0"]
  C --> H[":8113 → :9200"]
```

---

Parte de [wsl-labs](../../README.md) · catálogo [containers.config.json](../containers.config.json)
