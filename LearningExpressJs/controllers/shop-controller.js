const Product = require('../models/product-model');

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {

        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products"
        });
    });
    // console.log(adminData.products);
    // res.sendFile(path.join(routeDir, "views", "shop.html"));
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    // console.log(productID);
    Product.findById(productID, (product) => {
        res.render("shop/product-detail", {
            product: product,
            pageTitle: "Product " + productID + " Details",
            path: "shop/product-detail"
        });
    });

    // res.redirect('/');
}

exports.getIndex = (req, res, next) => {
    const products = Product.fetchAll(products => {

        res.render("shop/index", {
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
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart'
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/chekout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}