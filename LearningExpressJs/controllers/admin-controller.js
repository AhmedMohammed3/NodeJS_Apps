const Product = require('../models/product-model');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(routeDir, "views", "add-product.html"));
    res.render("admin/admin-edit-product", {
        pageTitle: "Admin Panel - Add Products",
        path: "/admin/add-product",
        editing: false
    });
}
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;
    Product.findById(productID, product => {
        if (!product) {
            return res.redirect('/');
        }
        console.log("Editing Product:", product);
        res.render("admin/admin-edit-product", {
            pageTitle: "Admin Products - Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product
        })
    });

}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/admin/products");
}

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(
        productID,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.deleteById(productID);
    res.redirect('/admin/products');
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

