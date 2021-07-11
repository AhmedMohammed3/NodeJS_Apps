const express = require("express");
const { check, body } = require('express-validator');

const authController = require('../controllers/auth-controller');
const User = require('../models/user-model')
const isNotAuth = require('../middlwares/is-auth-middleware').isNotAuth;
const router = express.Router();

router.get('/login', isNotAuth, authController.getLogin);

router.get('/signup', isNotAuth, authController.getSignup);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail({ gmail_remove_dots: false }),
        body('password', 'Password has to be valid')
            .isLength({ min: 6 })
            .isAlphanumeric()
    ]
    , authController.postLogin);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please entar a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email Already Exists');
                        }
                    })
            })
            .normalizeEmail({ gmail_remove_dots: false }),
        body(
            'password',
        )
            .isLength({ min: 6 })
            .withMessage('Please enter a password with at least 6 characters')
            .isAlphanumeric()
            .withMessage('Please enter a password with only numbers and text'),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match')
                }
                return true;
            })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;