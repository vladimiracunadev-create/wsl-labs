# System Specs — WSL Labs

> **Versión**: 0.1.2
> **Estado**: Activo
> **Uso recomendado**: Vista ejecutiva del sistema para entender capacidades y componentes sin entrar todavía al detalle técnico

---

## Resumen de componentes principales

| Componente | Stack | Puerto principal | Estado esperado |
| --- | --- | --- | --- |
| Control Center | Node.js (`http` nativo, sin deps) | `9092` | Operativo |
| Launcher Windows | Go 1.21 (stdlib puro) | — | Operativo |
| Servicios WSL2 | nginx / apache+php / node / flask / postgresql | `8080`–`8090`, `5432` | Operativo bajo demanda |
| Catálogo | `labs.config.json` | — | Fuente única de verdad |

## Capacidades visibles

| Capacidad | Presencia |
| --- | --- |
| Instalar servicios Linux desde el panel (1-click) | Sí |
| Arrancar / detener servicios en WSL | Sí |
| Ver logs por servicio desde el panel | Sí |
| Health-check TCP/HTTP en IPv4 e IPv6 | Sí |
| Ejecución privilegiada sin contraseña (root) | Sí |
| Keepalive de la instancia WSL | Sí |
| Launcher Windows que abre el navegador | Sí |

## Rutas principales del usuario

| Entrada | Uso |
| --- | --- |
| [http://localhost:9092](http://localhost:9092) | Control Center del workspace |
| [http://localhost:8080](http://localhost:8080) | NGINX (lab 05) |
| [http://localhost:8081](http://localhost:8081) | Apache + PHP (lab 06) |
| [http://localhost:8082](http://localhost:8082) | Node API (lab 07) |
| [http://localhost:8083](http://localhost:8083) | Flask (lab 08) |
| `postgres://localhost:5432` | PostgreSQL (lab 09) |
| [http://localhost:8090](http://localhost:8090) | Mini-servidor completo (lab 11) |

## Rutas clave del repositorio

| Ruta | Rol |
| --- | --- |
| `labs.config.json` | Catálogo — fuente única de verdad |
| `dashboard-server/server.js` | Backend del Control Center |
| `launcher/windows/main.go` | Launcher Windows (Go) |
| `installer/wsl-labs.iss` | Instalador Inno Setup |
| `scripts/install-*.sh` | Instaladores idempotentes por servicio |
| `labs/NN-*/` | Los 12 labs (guías + configs) |

## Requisitos operativos recomendados

| Escenario | Recomendación |
| --- | --- |
| Aprendizaje | Panel + labs de learning (sin servicios) |
| Demo de servicios | Panel + `05` + `07` + `09` |
| Stack combinado | Panel + `11` (mini-servidor) |

## Requisitos de base

- Windows 10 (2004+) o Windows 11 con **WSL 2**
- Una distro Linux (Ubuntu/Debian recomendada) con systemd
- Node.js 18+ (Control Center) · Go 1.21+ (solo para compilar el launcher)
- Git · PowerShell / Windows Terminal

## Documentos relacionados

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md)
- [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md)
- [README.md](README.md)
