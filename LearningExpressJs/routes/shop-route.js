const express = require("express");

const shopController = require('../controllers/shop-controller')

const router = express.Router();

router.get("/", shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productID', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

router.post('/create-order', shopController.postOrder)

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
