const express = require("express");
const { body } = require('express-validator');

const mainController = require('../controllers/main.controller');
const Option = require('../models/option.model');

const router = express.Router();

router.get('/options', mainController.getOptions);

router.post('/option', mainController.postOption);

router.delete('/option/:optionId', mainController.deleteOption);


module.exports = router;