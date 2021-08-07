const Product = require('../models/product.model');
const { handleError } = require('../helpers/error.helper');
const StatusCodes = require('http-status-codes');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.status(StatusCodes.OK).json({
				message: 'Fetched products successfully',
				items: products,
			});
		})
		.catch(err => handleError(err, next));
};