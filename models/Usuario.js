'use strict';

const mongoose = require('mongoose');
const bcrycpt = require('bcrypt');
const saltRounds = 10;

//creo el esquema
const usuarioSchema = mongoose.Schema({
    email: { type: String, require:true, unique: true },
    password: String
});

usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
    return bcrycpt.hash(passwordEnClaro, 7);
};

usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
    return bcrycpt.compare(passwordEnClaro, this.password);
}

usuarioSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrycpt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err);
                
            } else {
                document.password = hashedPassword;
                next();
            }
            
        });
    } else {
        next();
    }
});

//creo el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);


//exporto el modelo
module.exports = Usuario;