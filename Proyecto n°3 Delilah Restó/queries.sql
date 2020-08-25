CREATE DATABASE delilahRestoDB;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(60),
    mail VARCHAR(60) NOT NULL,
    telefono VARCHAR(60) NOT NULL,
    admin INT NOT NULL
    );

INSERT INTO usuarios (nombre_usuario, password, nombre, apellido, mail, telefono, admin) VALUES ("Admin", "sha1$6050ea5f$1$f2308f5f45cb43e7d0601d32a58d2796974fb999", "Admin", "Admin", "admin@admin.com", "116889261", 1);

CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(60) NOT NULL DEFAULT "Nuevo",
    usuario_id INT NOT NULL,
    direccion VARCHAR(60) NOT NULL,
    total INT,
    metodo_pago VARCHAR(60) NOT NULL,
    hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    precio INT NOT NULL
);

CREATE TABLE pedidos_productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL
    );
