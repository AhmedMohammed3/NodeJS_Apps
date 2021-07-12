const Product = require('../models/product-model');
const User = require('../models/user-model');
// const Cart = require('../models/cart-model');
const Order = require('../models/order-model');
const { fireErrorHandler } = require('../helpers/controllers-helper');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products"

            });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: "\"" + product.title + "\" Details",
                path: "/products"

            });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.getIndex = (req, res, next) => {
    Product.find().
        then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "LoL Shop",
                path: "/"
            });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts

            });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postCart = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const productID = req.body.productID;
    req.user.addToCart(productID)
        .then(result => {
            console.log("Added To Cart");
            res.redirect('/cart');
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postCartDeleteItem = (req, res, next) => {
    const productID = req.body.productID;
    req.user.deleteFromCart(productID)
        .then(result => {
            console.log('Product Deleted From Cart')
            res.redirect('/cart');
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productID._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userID: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            console.log('Order Created!');
            res.redirect('/orders');
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userID': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                orders: orders,
                path: '/orders',
                pageTitle: 'Your Orders'
            });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/chekout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}