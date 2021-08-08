const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
	'/signup',
	[
		body('email').trim().isEmail().withMessage('This is not an email'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('WEAK_PASSWORD: Password should be at least 6 characters'),
	],
	authController.postSignup
);

router.post('/login', authController.postLogin);

router.post(
	'/changepassword',
	[
		body('password')
			.isLength({ min: 6 })
			.withMessage('WEAK_PASSWORD: Password should be at least 6 characters'),
	],
	isAuth,
	authController.postChangePassword
);

module.exports = router;
