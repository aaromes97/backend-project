'use strict'

var express = require('express');
var router = express.Router();
const { Usuario } = require('../models');

router.post('/', (req, res, next) =>{
	if(req.body.email !== undefined && req.body.name !== undefined && req.body.password !== undefined) {
		const hash = bcrypt.hashSync(req.body.password, 5);

		Usuario.findOne({email: req.body.email}, (err, emailFound) => {
			if(!userFound) {
				Usuario.findOne({email: req.body.name}, (err, nameFound) => {
					if(!nameFound) {
						Usuario.UpdateOne({
							name: req.body.name,
							email: req.body.email,
							password: hash
						}, (err, userUpdated) => {
							if(userUpdated) {
								res.status(202).json({
									message: 'User updated successfully'
								});
							} else {
								res.status(404).json({
									message: 'User not updated'
								});
							}
						});
					} else {
						res.status(404).json({
							message: 'This username exists already'
						});
					}
				});
			} else {
				res.status(404).json({
					message: 'This email exists already'
				});
			}
		});
	}
});

module.exports = router;

