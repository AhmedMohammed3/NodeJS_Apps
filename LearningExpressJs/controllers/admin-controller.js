const fileHelper = require('../globals/file-helper');

const { validationResult } = require('express-validator');
const { fireErrorHandler } = require('../globals/error-helper');
const { PRODUCTS_PER_PAGE } = require('../globals/constants');

const Product = require('../models/product-model');
const User = require('../models/user-model');

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
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
        return res.status(422)
            .render("admin/admin-edit-product", {
                pageTitle: "Admin Panel - Add Products",
                path: "/admin/add-product",
                editing: false,
                product: {
                    title: title,
                    price: price,
                    description: description
                },
                hasError: true,
                errorMessage: 'Attached image must be jpg, png or jpeg',
                validationErrors: []
            });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422)
            .render("admin/admin-edit-product", {
                pageTitle: "Admin Panel - Add Products",
                path: "/admin/add-product",
                editing: false,
                product: {
                    title: title,
                    price: price,
                    description: description
                },
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userID: req.user
    });
    product.save()
        .then(_ => {
            console.log("Created Product!");
            res.redirect("/admin/products");
        })
        .catch(err => fireErrorHandler(err, next));
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
                return fireErrorHandler({
                    message: 'Product is not found in DB',
                    stack: __dirname
                }, next);
            }
            if (product.userID.toString() !== req.user._id.toString()) {
                return res.redirect('/page-not-found');
            }
            res.render("admin/admin-edit-product", {
                pageTitle: "Admin Products - Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: [],
                validationErrors: []
            })
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImage = req.file;
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
            if (updatedImage) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = updatedImageUrl;
            }
            product.description = updatedDescription;
            return product.save().then(result => {
                console.log("Updated product");
                res.redirect('/admin/products');
            })
        })
        .catch(err => fireErrorHandler(err, next));

}

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalNumOfProducts;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalNumOfProducts = numProducts;
            return Product.find()
                .skip((page - 1) * PRODUCTS_PER_PAGE)
                .limit(PRODUCTS_PER_PAGE);
        })
        .then(products => {
            // const numOfPages = totalNumOfProducts / PRODUCTS_PER_PAGE;
            res.render("admin/admin-products", {
                prods: products,
                pageTitle: "Admin Panel - All Products",
                path: "/admin/products",
                errorMessage: [],
                currentPage: page,
                hasNextPage: PRODUCTS_PER_PAGE * page < totalNumOfProducts,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalNumOfProducts / PRODUCTS_PER_PAGE)
            });
        })
        .catch(err => fireErrorHandler(err, next));
}

exports.deleteProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID)
        .then(product => {
            if (!product) {
                fireErrorHandler({
                    message: 'Product not found',
                    stack: 'Line 173 (admin-controller.js)'
                }, next)
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: productID, userID: req.user })
        })
        .then(result => {
            if (result.deletedCount > 0) {
                console.log("Product Deleted");
                return res.status(200).json({ message: 'Success!' });
            }
            res.status(500).json({ message: 'Deleting product failed' });
        })
        .catch(err => res.status(500).json({ message: 'Deleting product failed' }));
}


