const Cart = require('../models/cart.model');
const { StatusCodes } = require('http-status-codes');
const { throwError, handleError } = require('../helpers/error.helper');

exports.getCart = (req, res, next) => {
	Cart.find()
		.then(cart => {
			res.status(StatusCodes.OK).json({
				message: 'Fetched Cart Successfully',
				cart,
			});
		})
		.catch(err => handleError(err, next));
};
/*
============EXAMPLE Cart item==========
{
    _id: 0,
    title: 'Sushi',
    price: 23,
    total: 23,
    quantity: 2
}
=====================================
 */
exports.putItems = (req, res, next) => {
	const cartItems = req.body.cartItems;
	const cartNumOfItems = req.body.cartNumOfItems;
	const cartTotalPrice = req.body.cartTotalPrice;

	// const cart = new Cart({
	// 	cartItems,
	// 	cartNumOfItems,
	// 	cartTotalPrice,
	// });

	// cart
	// .save()
	// .then(savedCart => {
	//     if (!savedCart) {
	//         throwError("Can't save cart to DB", StatusCodes.INTERNAL_SERVER_ERROR);
	//     }
	//     res.status(StatusCodes.CREATED).json({
	//         message: 'Saved cart Successfully',
	//         cart: savedCart,
	//     });
	//     console.log('Cart Updated');
	// })
	// .catch(err => {
	//     handleError(err, next);
	// });

	Cart.find()
		.then(carts => {
			let cart;
			if (carts.length > 0) {
				cart = carts[0];
				cart.cartItems = cartItems;
				cart.cartNumOfItems = cartNumOfItems;
				cart.cartTotalPrice = cartTotalPrice;
			} else {
				cart = new Cart({
					cartItems,
					cartNumOfItems,
					cartTotalPrice,
				});
			}
			return cart.save();
		})
		.then(savedCart => {
			if (!savedCart) {
				throwError("Can't save cart to DB", StatusCodes.INTERNAL_SERVER_ERROR);
			}
			res.status(StatusCodes.CREATED).json({
				message: 'Saved cart Successfully',
				cart: savedCart,
			});
			console.log('Cart Updated');
		})
		.catch(err => {
			handleError(err, next);
		});
};
