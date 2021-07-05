const Product = require('../models/product-model');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(routeDir, "views", "add-product.html"));
    res.render("admin/admin-add-product", {
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

        res.render("admin/admin-products", {
            prods: products,
            pageTitle: "Admin Panel - All Products",
            path: "/admin/products"
        });
    });
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID, product => {
        res.render("admin/admin-edit-product", {
            product: product,
            pageTitle: "Admin Products - Edit Product",
            path: "/admin/products/edit-product"
        })
    });
}

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(productID, (product) => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        product.save();
        res.redirect('/admin/products');
    });
}