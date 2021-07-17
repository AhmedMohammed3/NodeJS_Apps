const { validationResult } = require('express-validator');
const { handleError, throwError } = require('../helpers/error.helper.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');
const { SECRET_TOKEN } = require('../helpers/constants.js');

exports.putSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwError('Validation failed', 422, errors.array());
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            });
            return user.save()
        })
        .then(createdUser => {
            console.log('User ' + createdUser._id + ' Created')
            res.status(201).json({ message: 'UserCreated!', userId: createdUser._id });
        })
        .catch(err => handleError(err, next));
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throwError('Email is not registerd', 404);
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) throwError('Wrong Password', 401);
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
                SECRET_TOKEN,
                { expiresIn: '1h' });
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })
        .catch(err => handleError(err, next));
}
exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(User => {
            if (!user) {
                throwError('Email is not registerd', 404);
            }
            res.status(200).json({ status: user.status });
        })
        .catch(err => handleError(err, next));
}

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                throwError('Email is not registerd', 404);
            }
            user.status = newStatus;
            return user.save();
        })
    then(result => {
        res.status(200).json({ message: 'User updated' });
    })
        .catch(err => handleError(err, next));
}