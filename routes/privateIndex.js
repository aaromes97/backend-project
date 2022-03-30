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
      const tags = req.body.tags.split(",")
      anunciosData = { ...req.body, foto: fotoPath, tags };
    } else {
      const tags = req.body.tags.split(",")
      anunciosData = { ...req.body, tags };
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
