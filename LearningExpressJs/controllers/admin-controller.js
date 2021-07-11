const { validationResult } = require('express-validator');

const Product = require('../models/product-model');

exports.getAddProduct = (req, res, next) => {
    res.render("admin/admin-edit-product", {
        pageTitle: "Admin Panel - Add Products",
        path: "/admin/add-product",
        editing: false,
        errorMessage: [],
        hasError: false,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .render("admin/admin-edit-product", {
                pageTitle: "Admin Panel - Add Products",
                path: "/admin/add-product",
                editing: false,
                product: {
                    title: title,
                    imageUrl: imageUrl,
                    price: price,
                    description: description
                },
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
    }
    const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl, userID: req.user });
    product.save()
        .then(_ => {
            console.log("Created Product!");
            res.redirect("/admin/products");
        }).catch(err => console.log("err", err));
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
            if (product.userID.toString() !== req.user._id.toString()) {
                return res.redirect('/page-not-found');
            }
            res.render("admin/admin-edit-product", {
                pageTitle: "Admin Products - Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                errorMessage: [],
                hasError: false,
                errorMessage: [],
                validationErrors: []
            })
        })
        .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render("admin/admin-edit-product", {
                pageTitle: "Admin Panel - Edit Products",
                path: "/admin/edit-product",
                editing: true,
                hasError: true,
                product: {
                    title: updatedTitle,
                    imageUrl: updatedImageUrl,
                    price: updatedPrice,
                    description: updatedDescription,
                    _id: productID
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
    }
    Product.findById(productID)
        .then(product => {
            if (product.userID.toString() !== req.user._id.toString()) {
                return res.redirect('/page-not-found');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save().then(result => {
                console.log("Updated product");
                res.redirect('/admin/products');
            })
        })
        .catch(err => console.log(err));

}

exports.getProducts = (req, res, next) => {
    Product.find({ userID: req.user })
        .then(products => {
            res.render("admin/admin-products", {
                prods: products,
                pageTitle: "Admin Panel - All Products",
                path: "/admin/products"

            });
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.deleteOne({ _id: productID, userID: req.user })
        .then(result => {
            if (result.deletedCount > 0) {
                console.log("Product Deleted");
                return res.redirect('/admin/products');
            }
            return res.redirect('/page-not-found');
        })
        .catch(err => console.log(err));
}


