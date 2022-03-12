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
// const ObjectId = require('mongodb').ObjectId;
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
});

// POST /api (body) -> completar en Postman | Multer
// Crear un anuncio
router.post('/', upload.single('foto'), async (req, res, next) => {
  try {
    const fotoPath = '/images/anuncios/' + req.file.originalname;
    const tags = req.body.tags.split(",")
    const anunciosData = { ...req.body, foto: fotoPath, tags };
    const anuncio = new Anuncio(anunciosData);
    const anuncioCreado = await anuncio.save(); // creamos anuncio en la BBDD

    res.status(201).json({ result: anuncioCreado });

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

//DELETE /api/id
router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    await Anuncio.deleteOne({ _id: _id })
    res.json({ deleted: "OK" });
  } catch (err) {
    next(err);
  }
})

//PUT /api/id
router.put('/:id', upload.single('foto'), async (req, res, next) => {
  try {
    let anunciosData;
    const _id = req.params.id;
    if (req.file) {
      const fotoPath = '/images/anuncios/' + req.file.originalname;
      anunciosData = { ...req.body, foto: fotoPath };
    } else {
      anunciosData = req.body;
    }
    const anuncioActualizado = await Anuncio.findOneAndUpdate({ _id: _id }, anunciosData, {
      new: true //si no lo ponemos nos devuelve el dato sin actualizar
    })
    res.json({ result: anuncioActualizado });
  } catch (err) {
    next(err);
  }
})

module.exports = router;
