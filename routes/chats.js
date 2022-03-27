var express = require("express");
var router = express.Router();
const Chats = require("../models/Chats");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const filtro = {};
    const chats = await Chats.lista(filtro);
    res.json({ results: chats });
  } catch (err) {
    next(err);
  }
});

// POST /api/chats (body) -> completar en Postman | Multer
// Crear un chat
router.post("/", async (req, res, next) => {
  try {
    const chatsData = { ...req.body };
    const chats = new Chats(chatsData);
    const chatCreado = await chats.save(); // creamos el chat en la BBDD

    res.status(201).json({ result: chatCreado });
  } catch (err) {
    next(err);
  }
});

//GET /api/chats/idAnuncio (chats)
router.get("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const chats = await Chats.find({ idAnuncio: _id });
    if (chats.length) {
      res.json({ results: chats });
    } else {
      res.json({ results: null });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:vendor", async (req, res, next) => {
  try {
    const vendedor = req.params.vendor;
    const chats = await Chats.find({ vendor: vendedor });
    res.json({ results: chats });
  } catch (err) {
    next(err);
  }
});

//PUT /api/chats/idAnuncio
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    chatsData = req.body;
    const chatActualizado = await Chats.findOneAndUpdate(
      { idAnuncio: _id },
      chatsData,
      {
        new: true, //si no lo ponemos nos devuelve el dato sin actualizar
      }
    );
    res.json({ result: chatActualizado });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
