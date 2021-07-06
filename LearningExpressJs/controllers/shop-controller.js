const Product = require('../models/product-model');
const Cart = require('../models/cart-model');

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
            pageTitle: "Product " + product.title + " Details",
            path: "/products"
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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productID;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productID;
    Product.findById(prodId, product => {
        console.log(product);
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
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