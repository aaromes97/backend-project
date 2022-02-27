'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const anuncioData = require('./anuncios.json');

main().catch(err => console.log(err));

async function main() {
    await initAnuncios();

    mongoose.connection.close();
}

async function initAnuncios() {
    // elimino todos los documentos de la colección de anuncios
    const deleted = await Anuncio.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

    // crear anuncios iniciales
    const anuncios = await Anuncio.insertMany(anuncioData.anuncios);
    console.log(`Creados ${anuncios.length} anuncios.`);
}