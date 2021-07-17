const jwt = require('jsonwebtoken');
const { SECRET_TOKEN } = require('../helpers/constants');
const { throwError } = require('../helpers/error.helper');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throwError('Not Authenticated', 401);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, SECRET_TOKEN);
    }
    catch (err) {
        throwError('', 500);
    }
    if (!decodedToken) {
        throwError('Not Authenticated', 401);
    }
    req.userId = decodedToken.userId
    next();
}