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
    if (typeof precio !== 'undefined') {
      console.log(precio, 'precio desde Api')
      filtro.precio = {}
      if (precio[0] > 0 && precio[1] > precio[0] ) {
        filtro.precio.$lte = precio[1]
        console.log('paso por aqui')
      
      }
      // if (precio[0] !== precio) {
      //   filtro.precio.$lte=precio[0]        
      // }
      else {
        filtro.precio = precio
        console.log('paso por else')
    }
  }
    // if (precio === "10-50") {
    //   filtro.precio = between;
    // }
    // if (precio === "10-") {
    //   filtro.precio = moreTen;
    // }
    // if (precio === "-50") {
    //   filtro.precio = lessFifty;
    // }
    // if (precio === 50) {
    //   filtro.precio = equal;
    // }
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
