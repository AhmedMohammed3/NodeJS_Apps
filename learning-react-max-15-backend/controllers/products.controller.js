const Product = require('../models/product.model');
const { handleError } = require('../helpers/error.helper');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.status(200).json({
				message: 'Fetched products successfully',
				items: products,
			});
		})
		.catch(err => handleError(err, next));
};