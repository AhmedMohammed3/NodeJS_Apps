const { StatusCodes } = require("http-status-codes");

exports.throwError = (msg, statusCode) => {
    const err = new Error(msg);
    err.statusCode = statusCode;
    throw err;
}

exports.handleError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    next(err);
}