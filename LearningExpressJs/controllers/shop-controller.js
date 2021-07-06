const Product = require('../models/product-model');
const Cart = require('../models/cart-model');

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products"
        });
    }).catch(err => console.log(err));
    // const products = Product.fetchAll(
    //     //     products => {
    //     //     res.render("shop/product-list", {
    //     //         prods: products,
    //     //         pageTitle: "All Products",
    //     //         path: "/products"
    //     //     });
    //     // }
    // ).then(([products]) => {
    //     res.render("shop/product-list", {
    //         prods: products,
    //         pageTitle: "All Products",
    //         path: "/products"
    //     });
    // }).catch(err => console.log(err));
    // console.log(adminData.products);
    // res.sendFile(path.join(routeDir, "views", "shop.html"));
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    // console.log(productID);
    // Product.findAll({
    //     where: {
    //         id: productID
    //     }
    // })
    Product.findByPk(productID)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: "\"" + product.title + "\" Details",
                path: "/products"
            });
        }).catch(err => console.log(err));
    // Product.findById(productID
    //     // productID, (product) => {
    //     //     res.render("shop/product-detail", {
    //     //         product: product,
    //     //         pageTitle: "Product " + product.title + " Details",
    //     //         path: "/products"
    //     //     });
    //     // }
    // ).then(([product]) => {
    //     res.render("shop/product-detail", {
    //         product: product[0],
    //         pageTitle: "\"" + product[0].title + "\" Details",
    //         path: "/products"
    //     });
    // }).catch(err => console.log(err));

    // // res.redirect('/');
}

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "LoL Shop",
            path: "/"
        });
    }).catch(err => console.log(err));
    // Product.fetchAll(
    //     // products => {
    //     // res.render("shop/index", {
    //     //     prods: products,
    //     //     pageTitle: "LoL Shop",
    //     //     path: "/"
    //     // });
    //     // }
    // ).then(([products, fieldData]) => {

    //     res.render("shop/index", {
    //         prods: products,
    //         pageTitle: "LoL Shop",
    //         path: "/"
    //     });

    // }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        }).then(cartProducts => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        })
        .catch(err => console.log(err));
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         });
    //     });
    // });
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productID } });
        }).then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productID)
        }).then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            })
        })
        .then(_ => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    // Product.findById(productID, product => {
    //     Cart.addProduct(productID, product.price);
    // });
    // res.redirect('/cart');
}

exports.postCartDeleteItem = (req, res, next) => {
    const productID = req.body.productID;
    Product.findById(productID, product => {
        console.log(product);
        Cart.deleteProduct(productID, product.price);
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