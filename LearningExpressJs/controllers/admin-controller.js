const Product = require('../models/product-model');

exports.getProducts = (req, res, next) => {
    Product.find()
    // .select('title price -_id')
    //     .populate('userID', 'name')
        .then(products => {
            console.log(products);
            res.render("admin/admin-products", {
                prods: products,
                pageTitle: "Admin Panel - All Products",
                path: "/admin/products",
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => console.log(err));
}

exports.getAddProduct = (req, res, next) => {
    res.render("admin/admin-edit-product", {
        pageTitle: "Admin Panel - Add Products",
        path: "/admin/add-product",
        editing: false,
        isAuthenticated: req.session.isAuthenticated
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/products');
    }
    const productID = req.params.productID;
    Product.findById(productID)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }
            res.render("admin/admin-edit-product", {
                pageTitle: "Admin Products - Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isAuthenticated
            })
        })
        .catch(err => console.log(err));
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl, userID: req.user });
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

    Product.findById(productID)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save();
        })
        .then(result => {
            console.log("Updated product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.findByIdAndRemove(productID)
        .then(_ => {
            // console.log("Product Deleted");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

}


