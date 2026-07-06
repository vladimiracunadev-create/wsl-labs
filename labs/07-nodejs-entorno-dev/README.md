# 07 · Entorno Node.js 🟢

> API Node.js de ejemplo en `localhost:8082`.

---

## 📋 Datos del lab

| Campo | Valor |
|---|---|
| Tipo | service |
| Estado | ✅ ready |
| Puerto | `8082` |
| URL | [http://localhost:8082](http://localhost:8082) |
| Health | HTTP |

---

## 📦 Instalación (una vez)

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v

cd ../../examples/node-api
npm install
```

> El ejemplo [`examples/node-api/server.js`](../../examples/node-api/server.js) escucha en
> `process.env.PORT || 3000`, por lo que respeta el puerto que le inyecta el catálogo.

---

## 🚀 Ejecutar

El catálogo arranca la API en segundo plano fijando `PORT=8082`:

```bash
cd "$WSL_LABS_ROOT/examples/node-api" && PORT=8082 nohup node server.js > /tmp/wsl-labs-node.log 2>&1 &
```

---

## ✅ Verificar

```bash
curl http://localhost:8082
tail -n 50 /tmp/wsl-labs-node.log
```

---

## 🧭 Desde el Control Center

En el dashboard ([http://localhost:9092](http://localhost:9092)) el botón **▶** de este lab
ejecuta el `startCommand` del catálogo (arranca `node server.js` con `PORT=8082`) sobre WSL,
y el estado de salud se comprueba por HTTP contra el puerto `8082`.

---

## 🛑 Detener

```bash
pkill -f 'node server.js' || true
```

---

## 🎯 Por qué importa

Node.js con Express es el punto de entrada para explorar APIs modernas. Ejecutar el servicio con `PORT` inyectado desde el entorno, en segundo plano y con logs a fichero, reproduce el patrón real de despliegue de un proceso gestionado por un orquestador o supervisor.

---

Parte de [wsl-labs](../../README.md) · ver [labs.config.json](../../labs.config.json)
