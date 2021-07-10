const User = require('../models/user-model')

exports.getLogin = (req, res, next) => {
    // const isAuthenticated = req.get('Cookie').split(';')[0].trim().split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('60e850ed599bff09a844c04d')
        .then(user => {
            req.session.isAuthenticated = true;
            req.session.user = user;
            req.session.save(err => {
                if (err) console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
}