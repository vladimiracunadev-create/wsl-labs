import json
import os
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer

PG_HOST = os.environ.get("PG_HOST", "wslc-postgres")
PG_PORT = int(os.environ.get("PG_PORT", 5432))
PORT = int(os.environ.get("PORT", 8000))


def pg_reachable():
    try:
        with socket.create_connection((PG_HOST, PG_PORT), timeout=2):
            return True
    except OSError:
        return False


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        ok = pg_reachable()
        self.send_response(200 if (self.path != "/health" or ok) else 503)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        body = {"status": "ok" if ok else "postgres-down"} if self.path == "/health" else {
            "project": "wsl-labs", "case": "05-postgres-api", "engine": "wslc",
            "postgres": "reachable" if ok else "sin conexión", "pgHost": PG_HOST,
        }
        self.wfile.write(json.dumps(body).encode())

    def log_message(self, *_):
        pass


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
