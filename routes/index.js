var express = require("express");
var router = express.Router();
const Anuncio = require("../models/Anuncio");

/* GET home page. */
<<<<<<< HEAD
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Backend Wallatrox' });
=======
router.get("/", async (req, res, next) => {
  try {
    const nombre = req.query.nombre;
    const tags = req.query.tags;
    const venta = req.query.venta;
    const precio = req.query.precio;
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
    if (precio === "10-50") {
      filtro.precio = between;
    }
    if (precio === "10-") {
      filtro.precio = moreTen;
    }
    if (precio === "-50") {
      filtro.precio = lessFifty;
    }
    if (precio === 50) {
      filtro.precio = equal;
    }
    const anuncios = await Anuncio.lista(filtro);
    res.json({ results: anuncios });
  } catch (err) {
    next(err);
  }
>>>>>>> origin/index
});



module.exports = router;
