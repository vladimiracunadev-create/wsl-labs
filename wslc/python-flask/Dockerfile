# wsl-labs · imagen WSLC real — app Flask
# Se construye con:  wslc build -t wsl-labs/python-flask:latest wslc/python-flask
FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
ENV PORT=8083
EXPOSE 8083
CMD ["python", "app.py"]
