var express = require("express");
var router = express.Router();
const Chats = require("../models/Chats");

router.get("/:vendor", async (req, res, next) => {
  try {
    const vendedor = req.params.vendor;
    const chats = await Chats.find({ $or: [{ vendedor: vendedor }, { comprador: vendedor }] });
    res.json({ results: chats });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
