const { StatusCodes } = require('http-status-codes');

const Quote = require('../models/quote.model');
const { throwError, handleError } = require('../helpers/error.helper');

exports.getQuotes = (req, res, next) => {
	Quote.find()
		.then(quotes => {
			if (!quotes) {
				throwError("Can't Fetch Quotes", StatusCodes.NOT_FOUND);
			}
			res.status(StatusCodes.OK).json({
				message: 'Fetched Quotes Successfully',
				quotes: quotes,
			});
			console.log('Sent Response with quotes successfully');
		})
		.catch(err => handleError(err, next));
};
exports.getQuote = (req, res, next) => {
	Quote.findById(req.params.quoteId)
		.then(quote => {
			if (!quote) {
				throwError("Can't Fetch Quote", StatusCodes.NOT_FOUND);
			}
			res.status(StatusCodes.OK).json({
				message: 'Fetched Quote Successfully',
				quote: quote,
			});
			console.log('Sent Response with the quote successfully');
		})
		.catch(err => handleError(err, next));
};

exports.postQuote = (req, res, next) => {
	const author = req.body.author;
	const text = req.body.text;

	const quote = new Quote({
		author,
		text,
	});

	quote
		.save()
		.then(savedQuote => {
			if (!savedQuote) {
				throwError("Can't save Quote", StatusCodes.INTERNAL_SERVER_ERROR);
			}
			res.status(StatusCodes.OK).json({
				message: 'Added Quote Successfully',
				savedQuote,
			});
		})
		.catch(err => handleError(err, next));
};
