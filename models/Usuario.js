'use strict';

const mongoose = require('mongoose');
const bcrycpt = require('bcrypt');

//creo el esquema
const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String
});

usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
    return bcrycpt.hash(passwordEnClaro, 7);
};

usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
    return bcrycpt.compare(passwordEnClaro, this.password);
}

//creo el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);


//exporto el modelo
module.exports = Usuario;