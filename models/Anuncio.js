"use strict";
const mongoose = require("mongoose");

//Definimos el esquema de Anuncio
const anuncioSchema = mongoose.Schema({
  nombre: String,
  foto: String,
  descripcion: String,
  venta: Boolean,
  precio: Number,
  autor: String,
  tags: [],
  fecha: { type: Date, default: Date.now },
});
anuncioSchema.statics.lista = function (request) {
  const query = Anuncio.find(request);

  return query.exec();
};
const Anuncio = mongoose.model("Anuncio", anuncioSchema);

module.exports = Anuncio;
