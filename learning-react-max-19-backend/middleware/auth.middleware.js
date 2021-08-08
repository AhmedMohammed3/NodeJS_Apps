const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const { SECRET_TOKEN } = require('../helpers/constants');
const { throwError } = require('../helpers/error.helper');

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');
	console.log('req.headers:', req.headers);
	console.log('authHeader:', authHeader);
	if (!authHeader) {
		throwError('Not Authenticated', StatusCodes.UNAUTHORIZED);
	}
	const token = authHeader.split(' ')[1];
	console.log('token', token);
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, SECRET_TOKEN);
	} catch (err) {
		throwError("Can't verify token", StatusCodes.INTERNAL_SERVER_ERROR);
	}
	if (!decodedToken) {
		throwError('Not Authenticated', StatusCodes.UNAUTHORIZED);
	}
	req.userId = decodedToken.userId;
	next();
};
