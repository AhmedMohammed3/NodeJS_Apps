const express = require('express');

const cartController = require('../controllers/cart.controller');
const router = express.Router();

router.get('/cart', cartController.getCart);

router.put('/add-item', cartController.putItems);

module.exports = router;
