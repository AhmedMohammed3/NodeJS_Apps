const Product = require('../models/product-model');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render("admin/admin-products", {
                prods: products,
                pageTitle: "Admin Panel - All Products",
                path: "/admin/products"
            });
        })
        .catch(err => console.log(err));
}

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
    Product.findByID(productID)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }
            res.render("admin/admin-edit-product", {
                pageTitle: "Admin Products - Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product
            })
        })
        .catch(err => console.log(err));
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, imageUrl, description, null, req.user._id);
    product.save()
        .then(_ => {
            console.log("Created Product!");
            res.redirect("/admin/products");
        }).catch(err => console.log("err", err));
}

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDescription, productID);
    // Product.findByPk(productID)
    return product.save()
        .then(result => {
            console.log("Updated product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.deleteByID(productID)
        .then(_ => {
            // console.log("Product Deleted");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

}


