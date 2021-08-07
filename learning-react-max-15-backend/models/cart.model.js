const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = Schema({
	cartItems: [
		{
			_id: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
			title: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
			total: {
				type: Number,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
		},
	],
	cartNumOfItems: {
		type: Number,
		required: true,
	},
	cartTotalPrice: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('Cart', cartSchema);
