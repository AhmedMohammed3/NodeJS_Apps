const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { SECRET_TOKEN } = require('../helpers/constants');
const { throwError, handleError } = require('../helpers/error.helper');

exports.postSignup = (req, res, next) => {
	console.log('signup');
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throwError(errors.array()[0].msg, StatusCodes.UNPROCESSABLE_ENTITY);
		throw error;
	}
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then(fetchedUser => {
			if (fetchedUser) {
				throwError('Email Already Registered', StatusCodes.CONFLICT);
			}
			return bcrypt.hash(password, 12);
		})
		.then(hashedPassword => {
			const user = new User({
				email,
				password: hashedPassword,
				name: email.split('@')[0],
			});
			return user.save();
		})
		.then(createdUser => {
			if (!createdUser) {
				throwError("Can't Create User", StatusCodes.INTERNAL_SERVER_ERROR);
			}
			res.status(StatusCodes.CREATED).json({
				message: 'Account Created Successfully',
				userId: createdUser._id,
			});
		})
		.catch(err => handleError(err, next));
};

exports.postLogin = (req, res, next) => {
	console.log('login');

	const email = req.body.email;
	const password = req.body.password;
	let user;
	User.findOne({ email: email })
		.then(fetchedUser => {
			user = fetchedUser;
			if (!fetchedUser) {
				throwError('Email Not Registered', StatusCodes.UNAUTHORIZED);
			}
			return bcrypt.compare(password, user.password);
		})
		.then(isEqual => {
			if (!isEqual) {
				throwError('Wrong Password', StatusCodes.UNAUTHORIZED);
			}
			const token = jwt.sign(
				{
					email: user.email,
					userId: user._id.toString(),
				},
				SECRET_TOKEN,
				{ expiresIn: '1h' }
			);
			res.status(StatusCodes.OK).json({
				message: 'Login successful',
				idToken: token,
				userId: user._id.toString(),
				expiresIn: 3600,
				registerd: true,
			});
		})
		.catch(err => handleError(err, next));
};

exports.postChangePassword = (req, res, next) => {
	console.log('changePass');
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throwError(errors.array()[0].msg, StatusCodes.UNPROCESSABLE_ENTITY);
		throw error;
	}
	const userId = req.userId;
	const newPassword = req.body.password;
	let user;
	User.findById(userId)
		.then(fetchedUser => {
			if (!fetchedUser) {
				throwError('Email Not Registered', StatusCodes.UNAUTHORIZED);
			}
			user = fetchedUser;
			return bcrypt.hash(newPassword.toString(), 12);
		})
		.then(hashedPassword => {
			console.log('hashedPassword', hashedPassword);
			user.password = hashedPassword;
			return user.save();
		})
		.then(editedUser => {
			if (!editedUser) {
				throwError("Can't Change Password", StatusCodes.INTERNAL_SERVER_ERROR);
			}
			res.status(StatusCodes.CREATED).json({
				message: 'Password changed Successfully',
				userId: editedUser._id,
			});
		})
		.catch(err => handleError(err, next));
};
