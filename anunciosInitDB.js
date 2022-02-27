'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const anuncioData = require('./anuncios.json');

main().catch(err => console.log(err));

async function main() {
    await new Promise((resolve) => dbConnection.once("open", resolve));
    if (
        !(await askYesNo("Estas seguro que quieres inicializar la BD? (yes/no)"))
    ) {
        console.log("Abortado el comando. No se ha borrado nada!");
        return process.exit(0);
    }
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

function askYesNo(questionText) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(questionText, (answer) => {
            rl.close();
            if (answer.toLowerCase() === "yes") {
                resolve(true);
                return;
            }
            resolve(false);
        });
    });
}