'use strict';

var express = require('express');
var router = express.Router();
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

router.get('/check', (req, res, next)  => {
	try{
		if(req.query.id !== undefined) {
			jwt.verify(req.query.id, process.env.JWT_SECRET, {
				algorithm: "HS256"
			}, (err, decoded2) => {
				if (err) {
					res.status(404).json({
						message: 'No valid url'
					});
				} else {
					res.status(202).json({
						message: 'Valid url'
					});
				}
			});


		} else {
			res.status(404).json({
				message: 'No valid url'
			});
		}
	} catch (err) {
		next(err);
	}
});

router.post('/reset', (req, res, next)  => {
	try {
		if(req.query.id !== undefined && req.body.email !== undefined && req.body.password !== undefined) {
			jwt.verify(req.query.id, process.env.JWT_SECRET, {
				algorithm: "HS256"
			}, (err, decoded2) => {
				if (err) {
					res.status(404).json({
						message: 'No valid url'
					});
				} else {
					Usuario.findOne({
						email: req.body.email
					}, (err, user) => {
						if(user) {
							if(bcrypt.compareSync(req.body.password, user.password) == true) {
								res.status(404).json({
									message: 'Key exists already'
								});
							} else {
								const hash = bcrypt.hashSync(req.body.password, 5);

								Usuario.updateOne({ _id: user._id }, { $set: { password: hash }
								}, (err, updated) => {
									if(updated) {
										res.status(202).json({
											message: 'Updated successfully'
										});
									} else {
										res.status(404).json({
											message: 'Password not updated'
										});
									}
								});
							}
						} else {
							res.status(404).json({
								message: 'User does not exists'
							});
						}
					});
				}
			});
		} else {
			res.status(404).json({
				message: 'No valid url'
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

						let transporter = nodemailer.createTransport({
							service: "gmail",
							auth: {
								user: "clonepop2022@gmail.com",
								pass: ""
							},
						});
						var mailOptions = {
							from: 'clonepop2022@gmail.com',
							to: req.body.email,
							subject: 'Reset your password from ClonePop',
							text: 'To reset your password, please, hit the following link:\n' +
							'http://localhost:3001/forgot-password/check/?id=' + jwtToken
						};
						transporter.sendMail(mailOptions, function(error, info){
							if (error){
								res.status(404).json({
									message: 'Mail was not sent'
								});

							} else {
								res.status(200).json({
									message: 'Email sent'
								});
							}
						});
					}
				})
			} else {
				res.status(404).json({
					message: 'Invalid Credentials'
				});
			}});
	} catch (err) {
		next(err);
	}
});

module.exports = router;