
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user-model')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('error')
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Email Not Registered');
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isAuthenticated = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid Credentials');
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                console.log('User Exists');
                req.flash('error', 'Email Already Exists');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
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
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'ahm.moh.has@gmail.com',
                        subject: 'Signup succeeded',
                        html: `<h1>LoL Shop</h1>
                        <p>You can reach our shop from <a href="http://localhost:1234/">this</a> link.</p>`
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'Email Not Exists');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'ahm.moh.has@gmail.com',
                    subject: 'Reset Password',
                    html: `
                    <p>You requested a password reset</p>
                    <p>You can reset your password from <a href="http://localhost:1234/new-password/${token}">this</a> link.</p>`
                });
            })
            .catch(err => console.log(err));
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
                    errorMessage: req.flash('error'),
                    userID: user._id.toString(),
                    passwordToken: token
                });
            }
            res.redirect('/page-not-found')
        })
        .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
    const userID = req.body.userID;
    const newPassword = req.body.password;
    const passwordToken = req.body.passwordToken;
    let resetUser;

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
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: req.body.email,
                        from: 'ahm.moh.has@gmail.com',
                        subject: 'Password Changed',
                        html: `
                    <h3>Password Changed</h3>
                    <p>Your password has been changed. if you think this is wrong, feel free to contact us at lol@lol.com</p>`
                    });
                })
        })
        .catch(err => console.log(err));
}