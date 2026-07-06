# System Specs — WSL Container Center

> **Versión**: v1
> **Estado**: Activo
> **Uso recomendado**: Vista ejecutiva del sistema para entender capacidades y componentes sin entrar todavía al detalle técnico

---

## Resumen de componentes principales

| Componente | Stack | Puerto principal | Estado esperado |
| --- | --- | --- | --- |
| Panel | Node.js (`http` nativo, sin deps) | `9092` | Operativo |
| Motor de contenedores | `wslc` (WSL 2.9+, preview) | — | Operativo (requisito) |
| Casos de contenedores | 12 casos portados de docker-labs (starter / platform / infra) | `8101`–`8114` | Operativo bajo demanda |
| Launcher Windows | Go 1.21 (stdlib puro) | — | Operativo |
| Catálogo | `containers/containers.config.json` | — | Fuente única de verdad |

## Capacidades visibles

| Capacidad | Presencia |
| --- | --- |
| Construir imágenes custom desde el panel (`wslc build`) | Sí |
| Levantar / bajar contenedores con un clic (`wslc run` / `stop` + `rm`) | Sí |
| Casos multi-contenedor sobre una red wslc dedicada | Sí |
| Ver logs por caso desde el panel (`wslc logs`) | Sí |
| Health-check HTTP en IPv4 e IPv6 | Sí |
| Localización automática de `wslc.exe` | Sí |
| Token opcional + rate-limit en la API | Sí |
| Launcher Windows que abre el navegador | Sí |

## Rutas principales del usuario

| Entrada | Uso |
| --- | --- |
| [http://localhost:9092](http://localhost:9092) | Panel del workspace |
| [http://localhost:8101](http://localhost:8101) | API Node.js (caso 01) |
| [http://localhost:8104](http://localhost:8104) | Nginx web (caso 06) |
| [http://localhost:8106](http://localhost:8106) | API + PostgreSQL (caso 05) |
| [http://localhost:8110](http://localhost:8110) | Prometheus + Grafana (caso 08) |
| [http://localhost:8114](http://localhost:8114) | Jenkins CI (caso 12) |

## Rutas clave del repositorio

| Ruta | Rol |
| --- | --- |
| `containers/containers.config.json` | Catálogo — fuente única de verdad |
| `containers/NN-*/` | Contexto y `Dockerfile` de cada caso custom |
| `dashboard-server/server.js` | Backend del panel (localiza y ejecuta `wslc.exe`) |
| `index.html` · `dashboard.css` · `dashboard.js` | UI del panel |
| `launcher/windows/main.go` | Launcher Windows (Go) |
| `installer/` | Instalador Inno Setup |

## Requisitos operativos recomendados

| Escenario | Recomendación |
| --- | --- |
| Primeros pasos | Panel + un caso starter (`01`, `06`) |
| Demo de stacks | Panel + `05` (postgres) + `04` (redis) + `09` (mongo) |
| Observabilidad / infra | Panel + `08` (Prometheus + Grafana) |

## Requisitos de base

- Windows 10 (2004+) o Windows 11 con **WSL 2.9+** y el motor `wslc`
  (`wsl --update --pre-release`)
- Node.js 18+ en **Windows** (para el panel) · Go 1.21+ (solo para compilar el launcher)
- Git · PowerShell / Windows Terminal

## Documentos relacionados

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md)
- [docs/wslc-contenedores.md](docs/wslc-contenedores.md)
- [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md)
- [README.md](README.md)
