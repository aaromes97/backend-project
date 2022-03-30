# API Clonepop ![PyPI - Status](https://img.shields.io/pypi/status/Alp)

## Descripción del Proyecto.

API Clonepop es un api desarrollada para la aplicacion web Clonepop, enfocada a la compra y venta de productos nuevos y usados en internet

## 🚀 Instalacion

1. Clona este proyecto con git clone.
2. Ve a la carpeta backend-project `cd backend-project`.
3. Instala las dependecias `npm install`.
4. Renombra el archivo .example.env a .env e introduce la direccion a tu conexión a la Base de datos.
5. Para inicializar la base de datos debes ejecutar `node init-db.js`.
6. Para desplegar unos anuncios iniciales deberas ejecutar `node anunciosInitDB.js`.
7. Para iniciar la aplicación ejecuta el comando `npm run start`.
8. Si deseas iniciar la aplicacion en modo cluster ejecuta el comando `npm run cluster`.

---

## ⚙️ Base de datos

Para el despliegue de la base de datos de esta api se ha utilizado MongoDB.

1. Comando para arrancar MongoDB (mac/linux)
   ./bin/mongod --dbpath ./data/db

---

## 📦 Metodos del API

### POST /api/register

Post para registrar el usuario con nombre email y contraseña como parametros.

### POST /api/authenticate

Post para logearnos en la API devolviendonos un token valido para acceder a las opciones privadas.

### GET /api/anuncios

Get para traernos una lista de los anuncios publicados en nuestra api y guardados en la BD.
Aquí podremos filtrar por diversos parámetros (nombre, precio minimo, precio maximo, autor, compra o venta).

### GET /api/forgot-password

Get para mandar un correo a la direccion de correo registrada por el usuario para crear nueva contraseña cuando al usuario se le ha olvidado la actual.

### GET /api/chat

Get utilizada para la implementacion del chat en el frontend

### GET /api/mensajes

Get para la notificacion de mensajes en el chat de usuario

### PUT /api/updateProfile

Put para actualizar el profile del usuario.

### PUT /api/deleteUser

Put para borrar el usuario de la BD.

---

## 🛠 Tecnologias

- [express](https://expressjs.com/es/): Version 4.16.1
- [ejs](hhttps://ejs.co/): Version 2.6.1
- [Socket.IO](https://socket.io): Version 4.4.1
- [nodemailer](https://nodemailer.com/about/): Version 6.7.2
- [bcrypt](https://www.npmjs.com/package/bcrypt): Version 5.0.1

---

## 🧾 Licencia

Este proyecto esta bajo la licencia [GNU](https://es.wikipedia.org/wiki/GNU_General_Public_License)

---

## ✒️ Autores

Aaron Méndez, Richard André Alcalde , Adrian Dueñas , Bernabé Jiménez.

---

## Agradecimientos

_A todo el equipo de Keep Conding por su pasión y su buen hacer a la hora de enseñar y formar a futuros desarrolladores_
