const express = require('express');
const { getProducts } = require('../controllers/products.controller');

const router = express.Router();

router.get('/getproducts', getProducts);

module.exports = router;
