'use strict';

var express = require('express');
var router = express.Router();
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/check', (req, res, next)  => {
	try{
		if(req.query.id !== undefined) {
			jwt.verify(req.query.id, process.env.JWT_SECRET, {
				algorithm: "HS256"
			}, (err, decoded2) => {
				if (err) {
					res.status(401).json({
						message: 'Esta url no es válida'
					});
				} else {
					Usuario.findOne({token: req.query.id}, (err, validToken) => {
						if(validToken) {
							res.status(200).json({
								message: 'Url valida'
							});

						} else {
							res.status(401).json({
								message: 'Esta url no es válida'
							});
						}
					});
				}
			});
		} else {
			res.status(401).json({
				message: 'Esta url no es válida'
			});
		}
	} catch (err) {
		next(err);
	}
});

router.post('/reset', (req, res, next)  => {
	try {
		if(req.query.id !== undefined && req.body.password !== undefined) {
			jwt.verify(req.query.id, process.env.JWT_SECRET, {
				algorithm: "HS256"
			}, (err, decoded2) => {
				if (err) {
					res.status(401).json({
						message: 'Esta url no es válida'
					});
				} else {
					Usuario.findOne({
						token: req.query.id
					}, (err, user) => {
						if(user) {
							if(bcrypt.compareSync(req.body.password, user.password) == true) {
								res.status(401).json({
									message: 'Esta contraseña ya existe'
								});
							} else {
								const hash = bcrypt.hashSync(req.body.password, saltRounds);

								Usuario.updateOne({ _id: user._id }, { $set: { password: hash, token: '' }
								}, (err, updated) => {
									if(updated) {
										res.status(200).json({
											message: 'Se ha actualizado correctamente'
										});
									} else {
										res.status(401).json({
											message: 'Ha habido un error al cambiar la contraseña'
										});
									}
								});
							}
						} else {
							res.status(401).json({
								message: 'Esta url no es válida'
							});
						}
					});
				}
			});
		} else {
			res.status(401).json({
				message: 'Esta url no es válida'
			});
		}
	} catch (err) {
		next(err);
	}
});

router.post('/', (req, res, next)  => {
	try {
		Usuario.findOne({
			email: req.body.email
		}, (err, data) => {
			if (data) {
				jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
					expiresIn: '2h',
					algorithm: "HS256",
				}, (err, jwtToken) => {
					if (err) {
						next(err)
					} else {
						Usuario.updateOne({ _id: data._id }, { $set: { token: jwtToken }
						}, (err, updated) => {
							if(updated) {

								let transporter = nodemailer.createTransport({
									service: "gmail",
									auth: {
										user: "clonepop20222@gmail.com",
										pass: "Clone2022"
									},
								});
								var mailOptions = {
									from: 'clonepop2022@gmail.com',
									to: req.body.email,
									subject: 'Reset your password from ClonePop',
									text: 'To reset your password, please, hit the following link:\n' +
									'http://localhost:3000/forgot-password/check/?id=' + jwtToken
								};
								transporter.sendMail(mailOptions, function(error, info){
									if (error){
										res.status(401).json({
											message: 'El correo no se ha podido enviar'
										});

									} else {
										res.status(200).json({
											message: 'El correo se ha enviado correctamente'
										});
									}
								});
							} else {
								res.status(401).json({
									message: 'El correo no se ha podido enviar'
								});
							}
						});
					}})
			} else {
				res.status(401).json({
					message: 'Las credenciales son incorrectas'
				});
			}});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
