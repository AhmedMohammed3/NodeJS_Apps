const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const { throwError } = require('../helpers/error.helper');
const { SECRET_TOKEN } = require('../helpers/constants.js');

const User = require('../models/user.model');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const email = userInput.email;
        const name = userInput.name;
        const password = userInput.password;
        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({ message: 'Please enter a valid E-mail' });
        }
        if (!validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
            errors.push({ message: 'Please enter a password that at least 6 characters long' });
        }
        if (errors.length > 0) {
            throwError('Invalid Input', 422, errors)
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throwError('Email already registered', 403);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },

    login: async function ({ email, password }) {
        const user = await User.findOne({ email: email })
        if (!user) {
            throwError('Email is not registerd', 404);
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throwError('Wrong Password', 401);
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        },
            SECRET_TOKEN,
            { expiresIn: '1h' }
        );
        return { token: token, userId: user._id.toString() }
    }
}