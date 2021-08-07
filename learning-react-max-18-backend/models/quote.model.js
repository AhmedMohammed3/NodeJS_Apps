const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quoteSchema = Schema({
	author: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Quote', quoteSchema);
