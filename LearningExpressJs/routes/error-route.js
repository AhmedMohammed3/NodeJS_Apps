const express = require("express");
const path = require("path");
const routeDir = require("../util/path");

const errorController = require('../controllers/error-controller');

const router = express.Router();

router.get('/500', errorController.get500);

router.use(errorController.get404);

module.exports = router;
