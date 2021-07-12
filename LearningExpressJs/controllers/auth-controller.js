
const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const User = require('../models/user-model');
const { sendMail } = require('../globals/send-email-helper');
const { fireErrorHandler } = require('../globals/error-helper');


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: [],
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: [],
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'login',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'login',
                        errorMessage: 'Email Not Registered',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: [{ param: 'email' }]
                    });
            }
            return bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isAuthenticated = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) return fireErrorHandler(err, next);
                            return res.redirect('/');
                        });
                    }
                    return res.status(422)
                        .render('auth/login', {
                            path: '/login',
                            pageTitle: 'login',
                            errorMessage: 'Invalid password for this email',
                            oldInput: {
                                email: email,
                                password: password
                            },
                            validationErrors: [{ param: 'password' }]
                        });
                })
                .catch(err => {
                    console.log(err);
                    return res.redirect('/login');
                });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password,
                    confirmPassword: req.body.confirmPassword
                },
                validationErrors: errors.array()
            });
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            console.log('Signed Up!');
            return sendMail(
                '/login',
                res,
                {
                    toEmail: email,
                    subject: 'Signup succeeded',
                    htmlContent: `<h1>LoL Shop</h1>
                        <p>You can reach our shop from <a href="http://localhost:1234/">this</a> link.</p>`
                }
            )
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return fireErrorHandler(err, next);
        res.redirect('/');
    });
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: [],
        oldInput: { email: "" },
        validationErrors: []
    });
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render('auth/reset', {
                path: '/reset',
                pageTitle: 'Reset Password',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                },
                validationErrors: errors.array()
            });
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) return fireErrorHandler(err, next);

        const token = buffer.toString('hex');

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.render('auth/reset', {
                        path: '/reset',
                        pageTitle: 'Reset Password',
                        errorMessage: 'Email is not registerd',
                        oldInput: { email: email },
                        validationErrors: errors.array()
                    });
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
                return user.save()
                    .then(result => {
                        return sendMail(
                            '/',
                            res,
                            {
                                toEmail: email,
                                subject: 'Reset Password',
                                html: `<p>You requested a password reset</p>
                         <p>You can reset your password from <a href="http://localhost:1234/new-password/${token}">this</a> link.</p>`
                            })
                    });
            })
            .catch(err => fireErrorHandler(err, next));
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (user) {
                return res.render('auth/new-password', {
                    path: '/new-password',
                    pageTitle: 'New Password',
                    errorMessage: [],
                    userID: user._id.toString(),
                    passwordToken: token,
                    validationErrors: [],
                    oldInput: {
                        newPassword: '',
                        confirmNewPassword: '',
                    }
                });
            }
            res.redirect('/page-not-found')
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postNewPassword = (req, res, next) => {
    const userID = req.body.userID;
    const newPassword = req.body.password;
    const confirmNewPassword = req.body.confirmPassword;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                userID: req.body.userID,
                passwordToken: passwordToken,
                oldInput: {
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword,
                }
            });
    }
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userID })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    resetUser.password = hashedPassword;
                    resetUser.resetToken = undefined;
                    resetUser.resetTokenExpiration = undefined;
                    return resetUser.save();
                })
                .then(result => {
                    return sendMail('/login',
                        res,
                        {
                            toEmail: resetUser.email,
                            subject: 'Password Changed',
                            html: `<h3>Password Changed</h3>
                    <p>Your password has been changed. if you think this is wrong, feel free to contact us at lol@lol.com</p>`
                        })
                })
        })
        .catch(err => fireErrorHandler(err, next));
}