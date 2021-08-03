exports.handleError = (err, next) => {
    if (!err.statusCode) {
        err.stautsCode = 500;
    }
    next(err);
}
exports.throwError = (msg, statusCode, data) => {
    const error = new Error(msg);
    error.statusCode = statusCode;
    if (data) {
        error.data = data;
    }
    throw error;
}