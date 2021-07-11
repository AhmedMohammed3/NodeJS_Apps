exports.isAuth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    next();
}

exports.isNotAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/');
    }
    next();
}