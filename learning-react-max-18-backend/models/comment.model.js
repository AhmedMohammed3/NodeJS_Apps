const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = Schema({
	quote: {
		type: Schema.Types.ObjectId,
		ref: 'Quote',
	},
	text: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Comment', commentSchema);
