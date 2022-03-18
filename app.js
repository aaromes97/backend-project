"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const LoginController = require("./controllers/loginController");
const jwtAuth = require("./lib/jwtAuthMiddleware");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const forgotPassword = require("./routes/forgotPassword");
var indexRouter = require("./routes/index");
const bcrycpt = require("bcrypt");
const Usuario = require("./models/Usuario");
var STATIC_CHANNELS = [{
  name: 'Global chat',
  participants: 0,
  id: 1,
  sockets: []
}, {
  name: 'Funny',
  participants: 0,
  id: 2,
  sockets: []
}];

/* jshint ignore:start */
require("./lib/connectMongoose");
/* jshint ignore:end */
// Cargamos las definiciones de todos nuestros modelos
require("./models/Usuario");

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(upload.array());
app.use(express.static("public"));
app.use(express.json());
app.use(logger("dev"));

/* jshint ignore:start */
/* jshint ignore:end */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const loginController = new LoginController();

// CHAT LISTENER

app.get('/api/chat', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
  console.log('new client connected');
  socket.emit('connection', null);
  socket.on('channel-join', id => {
    console.log('channel join', id);
    STATIC_CHANNELS.forEach(c => {
      if (c.id === id) {
        if (c.sockets.indexOf(socket.id) == (-1)) {
          c.sockets.push(socket.id);
          c.participants++;
          io.emit('channel', c);
        }
      } else {
        let index = c.sockets.indexOf(socket.id);
        if (index != (-1)) {
          c.sockets.splice(index, 1);
          c.participants--;
          io.emit('channel', c);
        }
      }
    });

    return id;
  });

  socket.on('send-message', message => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    STATIC_CHANNELS.forEach(c => {
      let index = c.sockets.indexOf(socket.id);
      if (index != (-1)) {
        c.sockets.splice(index, 1);
        c.participants--;
        io.emit('channel', c);
      }
    });
  });

});

app.get('/api/getChannels', (req, res) => {
  res.json({
    channels: STATIC_CHANNELS
  })
});

// API
app.post("/api/authenticate", loginController.postJWT);

app.use("/api/anuncios", require("./routes/index"));

app.use("/api/updateProfile", require("./routes/updateProfile"));

app.use("/", require("./routes/index"));

app.use("/api/forgot-password", forgotPassword);

// API
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  const usuario = new Usuario({ name, email, password });
  usuario.save((err) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Error al registrar el usuario/ Usuario ya existente",
        });
    } else {
      res.status(200).json({ message: "Usuario Registrado con exito" });
    }
  });
});
app.post("/api/authenticate", loginController.postJWT);
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  // catch 404 and forward to error handler
  err.status = 404;
  next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  // catch 404 and forward to error handler
  err.status = 404;
  next(err);
});
// error handler

app.use(function (err, req, res, next) {
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: "not valid", errors: err.mapped() }
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);

  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page

  res.render("error");
});

function isAPI(req) {
  return req.originalUrl.indexOf("/api") === 0;
}
module.exports = app;
