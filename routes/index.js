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
// const ObjectId = require('mongodb').ObjectId;
const upload = multer({ storage: storage })
const Anuncio = require("../models/Anuncio");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0
    const limit = parseInt(req.query.limit) || 1000 // nuestro api devuelve max 1000 registros
    const sort = req.query.sort || '_id'
    const includeTotal = req.query.includeTotal === 'true'
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
    const anuncios = await Anuncio.lista(filtro, start, limit, sort, includeTotal);
    res.json({ results: anuncios });
  } catch (err) {
    next(err);
  }
});

//GET /api/id
router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const anuncio = await Anuncio.find({ _id: _id });
    res.json({ results: anuncio });
  } catch (err) {
    next(err);
  }
})

module.exports = router;
