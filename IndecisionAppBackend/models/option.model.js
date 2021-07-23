const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const optionSchema = new Schema({
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Option', optionSchema);