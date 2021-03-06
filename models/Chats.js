"use strict";
const mongoose = require("mongoose");

//Definimos el esquema de Chats
const chatsSchema = mongoose.Schema({
  idAnuncio: String,
  nombreAnuncio: String,
  vendedor: String,
  comprador: String,
  mensajes: [Object],
  fecha: { type: Date, default: Date.now },
});
chatsSchema.statics.lista = function (request) {
  const query = Chats.find(request);

  return query.exec();
};
const Chats = mongoose.model("Chats", chatsSchema);

module.exports = Chats;
