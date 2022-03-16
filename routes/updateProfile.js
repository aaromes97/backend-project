'use strict';

var express = require('express');
var router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.put('/', (req, res, next)  => {
	try{
		let password = req.body.credentials.password;
		const email = req.body.credentials.email;
		const user = req.body.credentials.user;
		const id = req.body.id;


		if(id !== undefined && email !== undefined && user !== undefined ) {
			Usuario.findOne({
				_id: id
			}, (err, userFound) =>{
				if(userFound) {
					if(password !== undefined && password !== '') {
						password = bcrypt.hashSync(password, saltRounds);	
					} else {
						password = userFound.password;
					}
					Usuario.updateMany({
						_id: userFound
					}, {$set:{
						email: email,
						name: user,
						password: password
					}}, (err, emailValid) => {
						if(emailValid) {
							res.status(200).json({
								message: 'Se ha actualizado correctamente'
							});
						} else {
							res.status(401).json({
								message: 'Usuario y/o email ya existe'
							});
						}
					});
				} else {
					res.status(401).json({
						message: 'No se ha podido actualizar'
					});
				}
			});
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
