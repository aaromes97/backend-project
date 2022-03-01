'use strict';

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

class LoginController {
    
    // post a /api/authenticate
    async postJWT(req, res, next) {
        try {
            const { email, password } = req.body;
             //buscar el usuario en la base de datos
            const usuario = await Usuario.findOne({
                email
            });
            //si no lo encuentro o no coincide la contraseña ---> error
            if (!usuario || !(await usuario.comparePassword(password))) { 
                res.json({ error: 'Invalid Credentials' });
                return;
            }
            // si el usuario existe y valida la contraseña
            //crear un JWT con el _id del usuario dentro
            jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '2h'
            }, (err, jwtToken) => {
                if (err) {
                    next(err);
                    return;
                }
                //devolver al cliente el token generado
                res.json({ token: jwtToken });
            })

        } catch (err) {
            next(err);
        }
    }
}


module.exports = LoginController