'use strict'

var express = require('express');
var router = express.Router();
const { Usuario } = require('../models');

router.put('/', (req, res, next) => {
	try {
		const email = req.body.email;
		if(email !== undefined) {
			Usuario.deleteOne({email: email}, (err, userDeleted) => {
				if(userDeleted){
					res.sendStatus(200);
				} else {
					res.status(401).json({
						message: 'Ha habido un error al eliminar la cuenta'
					});
				}
			});
		} else {
			res.status(401).json({
				message: '11Ha habido un error al eliminar la cuenta'
			});
		}
	} catch (err){
		next(err);
	}

});

module.exports = router;
