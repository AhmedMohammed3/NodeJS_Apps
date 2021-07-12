exports.fireErrorHandler = (err, next) => {
    console.log("An Exception Occurred:", "\n", err.message, "\n", err.stack);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
}