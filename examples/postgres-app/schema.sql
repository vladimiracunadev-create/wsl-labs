CREATE TABLE IF NOT EXISTS labs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO labs (name, technology)
VALUES
('Servidor web Nginx', 'WSL'),
('API Node.js', 'WSL'),
('Base de datos PostgreSQL', 'WSL');
