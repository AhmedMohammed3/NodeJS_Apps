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

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

// router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderID', isAuth, shopController.getInvoice);

module.exports = router;
