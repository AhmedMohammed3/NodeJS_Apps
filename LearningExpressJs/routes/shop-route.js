const express = require("express");

const shopController = require('../controllers/shop-controller')

const router = express.Router();
const isAuth = require('../middlwares/is-auth-middleware').isAuth;

router.get("/", shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productID', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderID', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router;
