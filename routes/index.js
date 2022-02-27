var express = require("express");
var router = express.Router();
const Anuncio = require("../models/Anuncio");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const nombre = req.query.nombre;
  const descripcion = req.query.descripcion;
  const venta = req.query.venta;
  const precio = req.query.precio;
  const anuncios = await Anuncio.find({
    nombre: nombre,
    descripcion: descripcion,
    venta: venta,
    precio: precio,
  });
  res.render("index", { anuncios: anuncios });
});

module.exports = router;
