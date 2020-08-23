Archivos que conforman al proyecto:
	queries.sql / server.js / package.json / package-lock.json / spec.yaml / doc.html

--- Detalle:

- queries.sql: 
Se encuentran las tablas necesarias para realizar el CRUD de productos / Creacion de usuarios / realizar pedidos.
Ademas de los CREATE, se incluye un usuario administrador.
Con copiar y pegar las queries es suficiente.

-server.js: Archivo js donde se encuentran las API.

-package.json / package-lock.json : Archivo con el listado de dependencias necesarias para el PRY.

-spec.yaml y doc.html: Docuementacion de las api + ejemplos.

Pasos para instalar e iniciar el proyecto:

1- Abrir el archivo server.js
2- Iniciar la terminal y posicionarse en el path donde se encuentren los archivos
3- Ejecutar el comando npm install
4- Revisar la conexion de la base de datos. La misma se encuentra configurado en el archivo 'server.js' (FILA 9), por defecto se encuentra la siguiente configuracion: 
- "mysql://root:@localhost:3306/delilahRestoDB"
	user: root
	password: 
	puerto: 3306
	Nombre de la DB: delilahRestoDB
5- Ejecutar el archivo 'server.js'** --> node server.js

**Por defecto el server.js tiene configurado el puerto 3000, puede modificarse si se requiere.

User admin: Admin
Password: dino
