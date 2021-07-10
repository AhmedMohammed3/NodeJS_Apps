const Product = require('../models/product-model');
const User = require('../models/user-model');
// const Cart = require('../models/cart-model');
const Order = require('../models/order-model');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
                isAuthenticated: req.session.isAuthenticated
            });
        }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.find().
        then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/",
                isAuthenticated: req.session.isAuthenticated
            });
        }).catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: "\"" + product.title + "\" Details",
                path: "/products",
                isAuthenticated: req.session.isAuthenticated
            });
        }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    User.findById(req.user._id)
        .populate('cart.items.productID')
        .then(user => {
            const cartProducts = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts,
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => console.log(err));
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
        .catch(err => { console.log(err) });
}

exports.postCartDeleteItem = (req, res, next) => {
    const productID = req.body.productID;
    req.user.deleteFromCart(productID)
        .then(result => {
            console.log('Product Deleted From Cart')
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    User.findById(req.user._id)
        .populate('cart.items.productID')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productID._doc } };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
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
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userID': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                orders: orders,
                path: '/orders',
                pageTitle: 'Your Orders',
                isAuthenticated: req.session.isAuthenticated
            });
            // res.redirect('/')
        })
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/chekout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        isAuthenticated: req.session.isAuthenticated
    })
}