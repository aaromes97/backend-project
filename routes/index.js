var express = require("express");
var router = express.Router();
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/anuncios')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })
const Anuncio = require("../models/Anuncio");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const nombre = req.query.nombre;
    const tags = req.query.tags;
    const venta = req.query.venta;
    const precio = [req.query.precioMin, req.query.precioMax];
    const filtro = {};
    if (nombre) {
      filtro.nombre = new RegExp("^" + req.query.nombre, "i");
    }
    if (tags) {
      filtro.tags = tags;
    }
    if (venta) {
      filtro.venta = venta;
    }
    console.log(precio, 'precio desde Api')
    if (precio[0] != undefined && precio[1] == undefined) {
      filtro.precio = {};
      filtro.precio.$gte = precio[0]
      console.log('paso por min')

    }
    if (precio[1] != undefined && precio[0] == undefined) {
      filtro.precio = {}
      filtro.precio.$lte = precio[1]
      console.log('paso por max')
    }

    if (precio[0] != undefined && precio[1] != undefined) {
      filtro.precio = {}
      filtro.precio.$lte = precio[1]
      filtro.precio.$gte = precio[0]
      console.log('paso por aqui')

    }
  
     
    
    const anuncios = await Anuncio.lista(filtro);
    res.json({ results: anuncios });
  } catch (err) {
    next(err);
  }
});

// POST /api/anuncios (body) -> completar en Postman | Multer
// Crear un anuncio
router.post('/', upload.single('foto'), async (req, res, next) => {
  try {
    const fotoPath = '/images/anuncios/' + req.file.originalname;
    const anunciosData = { ...req.body, foto: fotoPath };
    const anuncio = new Anuncio(anunciosData);
    const anuncioCreado = await anuncio.save(); // creamos anuncio en la BBDD

    res.status(201).json({ result: anuncioCreado });

  } catch (err) {
    next(err);
  }
});

module.exports = router;