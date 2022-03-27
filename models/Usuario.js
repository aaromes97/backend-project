'use strict';

const mongoose = require('mongoose');
const bcrycpt = require('bcrypt');
const saltRounds = 10;

//creo el esquema
const usuarioSchema = mongoose.Schema({
    name: {type: String, require:true, unique:true},
    email: { type: String, require:true, unique: true },
    password: {type: String,
    required: true,
    trim: true,
    minlength: 7,
        validate(value) {
        console.log(value.length)
        if (value.toLowerCase().includes('password')) {
            throw new Error('Canno contain the string "Password".')
        } if (value.length < 7) {
        throw new Error('Debe contener al menos 7 caracteres')
    }
    }
    }
});

usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
    return bcrycpt.hashSync(passwordEnClaro, 7);
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
