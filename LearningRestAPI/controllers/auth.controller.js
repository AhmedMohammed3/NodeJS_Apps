const { validationResult } = require('express-validator');
const { handleError, throwError } = require('../helpers/error.helper.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');
const { SECRET_TOKEN } = require('../helpers/constants.js');

exports.putSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwError('Validation failed', 422, errors.array());
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        });
        const createdUser = await user.save()
        console.log('User ' + createdUser._id + ' Created')
        res.status(201).json({ message: 'UserCreated!', userId: createdUser._id });
    }
    catch (err) {
        handleError(err, next);
    };
}

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            throwError('Email is not registerd', 404);
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throwError('Wrong Password', 401);
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },
            SECRET_TOKEN,
            { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        return;
    }
    catch (err) {
        handleError(err, next);
        return err;
    }
}

exports.getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            throwError('Email is not registerd', 404);
        }
        res.status(200).json({ status: user.status });
    } catch (err) {
        handleError(err, next);
    }
}

exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            throwError('Email is not registerd', 404);
        }
        user.status = newStatus;
        const result = await user.save();
        res.status(200).json({ message: 'User updated' });
    } catch (err) {
        handleError(err, next);
    }
}