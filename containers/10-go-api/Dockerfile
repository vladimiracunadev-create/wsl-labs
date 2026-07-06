# Build multi-stage: compila el binario Go y lo copia a una imagen mínima.
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY main.go .
RUN go build -o /app ./main.go

FROM alpine:latest
COPY --from=build /app /app
EXPOSE 8080
CMD ["/app"]
