exports.handleError = (err, next) => {
	if (!err.statusCode) {
		err.stautsCode = 500;
	}
	next(err);
};
exports.throwError = (msg, statusCode) => {
	const error = new Error(msg);
	error.statusCode = statusCode;
	throw error;
};
