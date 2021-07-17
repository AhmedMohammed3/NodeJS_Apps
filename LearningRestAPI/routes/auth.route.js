const express = require('express');
const { body } = require('express-validator')

const authController = require('../controllers/auth.controller');
const User = require('../models/user.model.js');

const router = express.Router();

router.put('/signup', [
    body('email').trim()
        .isEmail()
        .withMessage('please enter a valid email')
        .custom((emailVal, { req }) => {
            return User.findOne({ email: emailVal })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                })
        }),
    body('password')
        .isLength({ min: 6 }),
    body('name').trim()
        .not().isEmpty()

], authController.putSignup);

router.post('/login', authController.postLogin);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
    body('status').trim()
        .not().isEmpty()
],
    authController.updateUserStatus)

module.exports = router;