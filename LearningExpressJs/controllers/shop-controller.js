const Product = require('../models/product-model');

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {

        res.render("shop/product-list-view", {
            prods: products,
            pageTitle: "All Products",
            path: "/products"
        });
    });
    // console.log(adminData.products);
    // res.sendFile(path.join(routeDir, "views", "shop.html"));
}

exports.getIndex = (req, res, next) => {
    const products = Product.fetchAll(products => {

        res.render("shop/index-view", {
            prods: products,
            pageTitle: "LoL Shop",
            path: "/",
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart-view', {
        path: '/cart',
        pageTitle: 'Your Cart'
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders-view', {
        path: '/orders',
        pageTitle: 'Your Orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/chekout-view', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}