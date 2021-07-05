const Product = require('../models/product-model');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(routeDir, "views", "add-product.html"));
    res.render("admin/add-product-view", {
        pageTitle: "Admin Panel - Add Products",
        path: "/admin/add-product",
        activeAddProduct: true,
        productCSS: true,
        formsCSS: true,
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect("/");
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {

        res.render("admin/products-view", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products"
        });
    });
}