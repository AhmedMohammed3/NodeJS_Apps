const Product = require('../models/product-model');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(routeDir, "views", "add-product.html"));
    res.render("add-product-view", {
        pageTitle: "Admin Panel - Add Products",
        path: "/admin/add-product",
        activeAddProduct: true,
        productCSS: true,
        formsCSS: true,
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();
    // console.log(adminData.products);
    // res.sendFile(path.join(routeDir, "views", "shop.html"));

    res.render("shop-view", {
        prods: products,
        pageTitle: "LoL Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
}