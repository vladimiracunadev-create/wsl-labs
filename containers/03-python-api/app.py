import os
from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/")
def index():
    return jsonify(project="wsl-labs", case="03-python-api", engine="wslc", runtime="container")


@app.get("/health")
def health():
    return jsonify(status="ok")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
