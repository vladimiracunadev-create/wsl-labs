# 11 · Mini servidor completo 🧰

> Stack combinado (web + app + db) en `localhost:8090`.

---

## 📋 Datos del lab

| Campo | Valor |
|---|---|
| Tipo | service |
| Estado | ✅ ready |
| Puerto | `8090` |
| URL | [http://localhost:8090](http://localhost:8090) |
| Health | HTTP |

---

## 📦 Instalación base (una vez)

Levanta las piezas del stack con los scripts de instalación de la suite:

```bash
../../scripts/install-base.sh
../../scripts/install-nginx.sh
../../scripts/install-node.sh
../../scripts/install-postgresql.sh
```

Y prepara la API de ejemplo:

```bash
cd ../../examples/node-api
npm install
```

---

## 🚀 Ejecutar

El catálogo arranca el stack combinado (web + base de datos):

```bash
sudo service nginx start && sudo service postgresql start
```

---

## ✅ Verificar

```bash
curl http://localhost:8090
curl http://localhost
sudo systemctl status postgresql
```

Debes obtener un mini entorno de servidor Linux funcionando dentro de WSL.

---

## 🧭 Desde el Control Center

En el dashboard ([http://localhost:9092](http://localhost:9092)) el botón **▶** de este lab
ejecuta el `startCommand` del catálogo (`sudo service nginx start && sudo service postgresql start`)
sobre WSL, y el estado de salud se comprueba por HTTP contra el puerto `8090`.

---

## 🛑 Detener

```bash
sudo service nginx stop && sudo service postgresql stop
```

---

## 🎯 Por qué importa

Este lab reúne todo lo anterior —servidor web, aplicación y base de datos— en un único stack que arranca y se detiene con un solo comando. Es la demostración de que WSL puede alojar un servidor completo, la culminación práctica de la suite.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
