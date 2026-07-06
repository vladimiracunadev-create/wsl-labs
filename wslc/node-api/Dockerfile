# wsl-labs · imagen WSLC real — API Node.js
# Se construye con:  wslc build -t wsl-labs/node-api:latest wslc/node-api
FROM node:20-alpine
WORKDIR /app
COPY server.js .
ENV PORT=8082
EXPOSE 8082
CMD ["node", "server.js"]
