const { StatusCodes } = require('http-status-codes');

const Comment = require('../models/comment.model');
const { throwError, handleError } = require('../helpers/error.helper');

exports.postComment = (req, res, next) => {
	const quoteId = req.params.quoteId;
	console.log(req.body);
	const text = req.body.text;

	const comment = new Comment({
		quote: quoteId,
		text,
	});

	comment
		.save()
		.then(savedComment => {
			if (!savedComment) {
				throwError("Can't Save Comment", StatusCodes.INTERNAL_SERVER_ERROR);
			}
			res.status(StatusCodes.OK).json({
				message: 'Saved Comment Successfully',
				savedComment,
			});
		})
		.catch(err => handleError(err, next));
};

exports.getComments = (req, res, next) => {
	const quoteId = req.params.quoteId;
	Comment.find({ quote: quoteId })
		.then(comments => {
			if (!comments) {
				throwError("Can't fetch Comments", StatusCodes.INTERNAL_SERVER_ERROR);
			}
			res.status(StatusCodes.OK).json({
				message: 'Fetched Comments Successfully',
				comments,
			});
		})
		.catch(err => handleError(err, next));
};
