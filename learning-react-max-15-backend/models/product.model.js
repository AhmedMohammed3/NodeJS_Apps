const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = Schema({
	title: {
		type: String,
		required: false,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Product', productSchema);
