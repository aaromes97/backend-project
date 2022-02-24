'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

require('./lib/connectMongoose');
const { Usuario } = require('./models');

main().catch(err => console.log(err));

async function main() {
    //Inicializo la coleccion de Usuarios
    await initUsuarios();
    mongoose.connection.close();
};

async function initUsuarios() {
    //dejamos la base de datos en estado inicial
    const { deletedCount } = await Usuario.deleteMany();
    console.log(`Eliminados ${deletedCount} usuarios.`);
    //insertamos Usuarios de prueba
    const result = await Usuario.insertMany([
        {
            email: 'admin@example.com',
            password: await Usuario.hashPassword('1234')
        },
        {
            email: 'user@example.com',
            password: await Usuario.hashPassword('5678')
        }
    ]);
    console.log(`insertados ${ result.length} usuarios`)
}