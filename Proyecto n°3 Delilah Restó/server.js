// Require utilizados
const express = require("express");
const Sequelize = require("sequelize");
const hash = require("password-hash");
const mysql = require('mysql2');
const jwt = require("jsonwebtoken");

// Conexion a la base de datos SQL
const sequelize = new Sequelize("mysql://root:@localhost:3306/delilahRestoDB");

// Express initialization
const app = express();
app.use(express.json());

app.listen(3000, function() {
    console.log("Servidor iniciado - Puerto 3000");
});

// Password para generar el JWT
const passwordJwt = "DelilahResto2020";

// Funcion para validar usuario y contraseña.
function validarUsuario(req, res, next) {
    let nombreusuario = req.body.nombreusuario;
    let password = req.body.password;
    if (typeof nombreusuario != undefined && typeof password != undefined) {
        sequelize.query("SELECT * FROM usuarios WHERE nombre_usuario= ?", {
                replacements: [nombreusuario],
                type: sequelize.QueryTypes.SELECT
            })
            .then(resultados => {
                let usuario = resultados[0];
                if (usuario == undefined) {
                    res.status(400).json("Usuario inexistente");
                } else {
                    if (hash.verify(password, usuario.password)) {
                        usuario_token = {
                            id_usuario: usuario.id,
                            nombreusuario: nombreusuario,
                            admin: usuario.admin
                        };
                        const token = jwt.sign({ usuario_token }, passwordJwt);
                        req.locals = token;
                        return next();
                    } else {
                        res.status(400).json("Contraseña incorrecta");
                    }
                }
            })
            .catch(err => {
                res.status(400).json("Ha ocurrido un error autenticando");
            });
    }
}

// Middleware para revisar si el user es admin
function usuarioAdmin(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json("Acceso denegado, primero se debe iniciar sesión");
    } else {
        const verificado = jwt.verify(token, passwordJwt);
        let usuario = verificado.usuario_token;
        if (usuario.admin == 1) {
            return next();
        } else {
            res.status(403).json("Acceso denegado. Sólo administradores");
        }
    }
}

// Middleware para revisar que el usuario haya realizado un inicio de sesion
function darAcceso(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json("Acceso denegado, primero se debe iniciar sesión");
    } else {
        const verificado = jwt.verify(token, passwordJwt);
        let usuario = verificado.usuario_token;
        if (usuario != undefined) {
            req.locals = usuario;
            return next();
        } else {
            res.status(403).json("Token inválido");
        }
    }
}

//Calcula el total de un pedido realizado
async function carrito(req, res, next) {
    let productos = req.body.productos;
    let cantidades = req.body.cantidades;
    let total = 0;
    for (var i = 0; i < productos.length; i++) {
        let cantidad = cantidades[i];
        await sequelize.query("SELECT precio FROM productos WHERE id = ?", {
                replacements: [productos[i]],
                type: sequelize.QueryTypes.SELECT
            })
            .then(resultados => {
                let precio = resultados[0].precio;
                total = total + precio * cantidad;
            })
            .catch(error => res.status(400).json("Algo salió mal"));
    }
    res.locals = total;
    return next();
}

// Endpoint para crear usuario
app.post("/usuarios", (req, res) => {
    nombreusuario = req.body.nombreusuario;
    password = req.body.password;
    passwordEncriptada = hash.generate(password);
    nombre = req.body.nombre;
    apellido = req.body.apellido;
    email = req.body.email;
    telefono = req.body.telefono;

    if (!nombreusuario ||
        !password ||
        !nombre ||
        !apellido ||
        !email ||
        !telefono
    ) {
        res.status(400).json("Hay campos obligatorios vacíos");
    } else {
        sequelize.query("SELECT id FROM usuarios WHERE nombre_usuario=?", {
                replacements: [nombreusuario],
                type: sequelize.QueryTypes.SELECT
            })
            .then(resultados => {
                if (resultados.length == 0) {
                    sequelize.query(
                            "INSERT INTO usuarios (nombre_usuario, password, nombre, apellido, mail, telefono,admin) VALUES (?,?,?,?,?,?,?)", {
                                replacements: [
                                    nombreusuario,
                                    passwordEncriptada,
                                    nombre,
                                    apellido,
                                    email,
                                    telefono,
                                    0
                                ]
                            }
                        )
                        .then(resultados => {
                            res.status(201).json("El usuario ha sido creado con éxito");
                        });
                } else {
                    res.status(400).json("El nombre de usuario no está disponible");
                }
            });
    }
});

// Endpoint para listar todos los usuarios
app.get("/usuarios", usuarioAdmin, (req, res) => {
    sequelize.query("SELECT nombre_usuario, nombre, apellido, mail, telefono,admin FROM usuarios", { type: sequelize.QueryTypes.SELECT })
        .then(resultados => {
            res.status(200).json(resultados);
        });
});

// Endpoint para iniciar sesión
app.post("/login", validarUsuario, (req, res) => {
    const token = req.locals;
    res.status(200).json({ "token": token });
});

// Endpoint para crear productos
app.post("/productos", usuarioAdmin, (req, res) => {
    nombre = req.body.nombre;
    precio = req.body.precio;

    sequelize.query("INSERT INTO productos (nombre, precio) VALUES (?,?)", {
            replacements: [nombre, precio]
        })
        .then(resultados => {
            res
                .status(201)
                .json("El producto se creo con exito");
        });
});

// Endpoint para eliminar productos
app.delete("/productos/:id", usuarioAdmin, (req, res) => {
    const producto_id = req.params.id;
    sequelize.query("DELETE FROM productos WHERE id = ?", {
            replacements: [producto_id]
        })
        .then(resultados => {
            res.status(200).json("Se ha eliminado el producto");
        });
});

// Endpoint para editar productos
app.patch("/productos/:id", usuarioAdmin, (req, res) => {
    let id_producto = req.params.id;
    let nuevo_nombre = req.body.nuevo_nombre;
    let nuevo_precio = req.body.nuevo_precio;
    if (nuevo_nombre != undefined && nuevo_precio != undefined) {
        sequelize.query("UPDATE productos SET nombre = ?, precio = ? WHERE id = ?", {
                replacements: [nuevo_nombre, nuevo_precio, id_producto]
            })
            .then(resultados => {
                res.status(200).json("Se realizaron los cambios");
            });
    } else if (nuevo_nombre != undefined) {
        sequelize.query("UPDATE productos SET nombre = ? WHERE id = ?", {
                replacements: [nuevo_nombre, id_producto]
            })
            .then(resultados => {
                res.status(200).json("El nombre del producto ha sido actualizado");
            });
    } else if (nuevo_precio != undefined) {
        sequelize.query("UPDATE productos SET precio = ? WHERE id = ?", {
                replacements: [nuevo_precio, id_producto]
            })
            .then(resultados => {
                res.status(200).json("El precio del producto ha sido actualizado");
            });
    }
});

// Endpoint para listar todos los productos disponibles, sólo usuarios autenticados y admin
app.get("/productos", darAcceso, (req, res) => {
    sequelize
        .query("SELECT * FROM productos", { type: sequelize.QueryTypes.SELECT })
        .then(resultados => {
            res.status(200).json(resultados);
        });
});

// Endpoint para realizar un nuevo pedido, usuarios autenticados
app.post("/pedidos", darAcceso, carrito, (req, res) => {
    let usuario_id = req.locals.id_usuario;
    let direccion = req.body.direccion;
    let total = res.locals;
    let metodo_pago = req.body.metodo_pago;
    let productos = req.body.productos;
    let cantidades = req.body.cantidades;

    sequelize.query(
            "INSERT INTO pedidos (usuario_id, direccion, total, metodo_pago) VALUES (?,?,?,?)", {
                replacements: [usuario_id, direccion, total, metodo_pago]
            }
        )
        .then(resultados => {
            sequelize.query("SELECT id FROM pedidos ORDER BY id DESC LIMIT 1", {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(resultados => {
                    let pedido_id = resultados[0].id;
                    for (var i = 0; i < productos.length; i++) {
                        let producto = productos[i];
                        let cantidad = cantidades[i];
                        sequelize.query(
                            "INSERT INTO pedidos_productos (pedido_id, producto_id, cantidad) VALUES (?,?,?)", {
                                replacements: [pedido_id, producto, cantidad]
                            }
                        );
                    }
                    res.status(200).json("El pedido fue realizado con éxito");
                });
        });
});

// Endpoint para listar todos los pedidos, sólo administrador
app.get("/pedidos", usuarioAdmin, (req, res) => {
    sequelize.query(
            "SELECT pedidos.*, productos.nombre AS nombre_producto, pedidos_productos.cantidad FROM pedidos JOIN pedidos_productos ON pedidos_productos.pedido_id = pedidos.id JOIN productos ON pedidos_productos.producto_id = productos.id", { type: sequelize.QueryTypes.SELECT }
        )
        .then(resultados => {
            res.status(200).json(resultados);
        });
});

// Endpoint para actualizar el estado de un pedido, sólo administradores
app.patch("/pedidos/:id", usuarioAdmin, (req, res) => {
    let id_pedido = req.params.id;
    let nuevo_estado = req.body.nuevo_estado;
    sequelize
        .query("UPDATE pedidos SET estado = ? WHERE id = ?", {
            replacements: [nuevo_estado, id_pedido]
        })
        .then(resultados => {
            res.status(200).json("El estado del pedido fue modificado");
        });
});