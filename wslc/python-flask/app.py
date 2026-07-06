import os

from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/")
def index():
    return jsonify(
        project="wsl-labs",
        runtime="wslc-container",
        service="python-flask",
        image="wsl-labs/python-flask",
        port=int(os.environ.get("PORT", 8083)),
    )


@app.get("/health")
def health():
    return jsonify(status="ok")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8083)))
