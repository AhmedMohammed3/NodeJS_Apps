const Product = require('../models/product-model');
// const Cart = require('../models/cart-model');
// const Order = require('../models/order-model');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products"
        });
    }).catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findByID(productID)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: "\"" + product.title + "\" Details",
                path: "/products"
            });
        }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/"
        });
    }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cartProducts => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    req.user.addToCart(productID)
        .then(result => {
            console.log("Added To Cart");
            res.redirect('/cart');
        })
        .catch(err => { console.log(err) });
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: productID } });
    //     }).then(products => {
    //         let product;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }

    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //         }
    //         return Product.findByPk(productID)
    //     }).then(product => {
    //         return fetchedCart.addProduct(product, {
    //             through: {
    //                 quantity: newQuantity
    //             }
    //         })
    //     })
    //     .then(_ => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
}

exports.postCartDeleteItem = (req, res, next) => {
    const productID = req.body.productID;
    req.user.deleteFromCart(productID)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            console.log('Order Created!');
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                orders: orders,
                path: '/orders',
                pageTitle: 'Your Orders'
            });
            // res.redirect('/')
        })
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/chekout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}