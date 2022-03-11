'use strict'

var express = require('express');
var router = express.Router();
const { Usuario } = require('../models');

router.post('/', (req, res, next) =>{
	if(req.body.email !== undefined) {
		Usuario.remove({email: req.body.email}, (err, userFound) => {
			if(err) {
				res.status(404).json({
					message: 'user not found'
				});
			} else {
				res.status(202).json({
					message: 'User deleted successfully'
				});
			}
		});
	}
});

module.exports = router;
