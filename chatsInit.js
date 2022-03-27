"use strict";

require("dotenv").config();
const mongoose = require("mongoose");

require("./lib/connectMongoose");
const { Chats } = require("./models");

main().catch((err) => console.log(err));

async function main() {
  //Inicializo la coleccion de Usuarios
  await initChats();
  mongoose.connection.close();
}

async function initChats() {
  //dejamos la base de datos en estado inicial
  const { deletedCount } = await Chats.deleteMany();
  console.log(`Eliminados ${deletedCount} chats.`);
  //insertamos Usuarios de prueba
  //   const result = await Chats.insertMany([
  //     // {
  //     //   idAnuncio: "6237651a83f3b22973adaeb9",
  //     //   nombreAnuncio: "ola",
  //     //   vendedor: "pepe",
  //     //   comprador: "admin",
  //     //   mensajes: [
  //     //     {
  //     //       username: "pepe",
  //     //       text: "Estoy interesado",
  //     //     },
  //     //     {
  //     //       username: "admin",
  //     //       text: "Te paso mi telf",
  //     //     },
  //     //   ],
  //     // },
  //   ]);
  console.log(`insertados ${result.length} chats`);
}
