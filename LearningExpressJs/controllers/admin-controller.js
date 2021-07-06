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
    Product.findByPk(productID)
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
    // Product.findById(productID, product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     console.log("Editing Product:", product);
    //     res.render("admin/admin-edit-product", {
    //         pageTitle: "Admin Products - Edit Product",
    //         path: "/admin/edit-product",
    //         editing: editMode,
    //         product: product
    //     })
    // });

}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    }).then(_ => {
        console.log("Created Product!");
        res.redirect("/admin/products");
    }).catch(err => console.log("err", err));
    // const product = new Product(null, title, imageUrl, description, price);
    // // product.save();
    // product.save().then(result => {
    //     res.redirect("/admin/products");
    // }).catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(productID)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            return product.save();
        }).then(result => {
            console.log("Updated product " + result.dataValues.id);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    // const updatedProduct = new Product(
    //     productID,
    //     updatedTitle,
    //     updatedImageUrl,
    //     updatedDescription,
    //     updatedPrice
    // );
    // updatedProduct.save();
}

exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.findByPk(productID)
        .then(product => {
            return product.destroy();
        }).then(result => {
            console.log("Product Deleted");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    // Product.deleteById(productID);
}
exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render("admin/admin-products", {
                prods: products,
                pageTitle: "Admin Panel - All Products",
                path: "/admin/products"
            });
        })
        .catch(err => console.log(err));
    // Product.fetchAll(
    //     // products => {
    //     //     res.render("admin/admin-products", {
    //     //         prods: products,
    //     //         pageTitle: "Admin Panel - All Products",
    //     //         path: "/admin/products"
    //     //     });
    //     // }
    // ).then(([products]) => {
    //     res.render("admin/admin-products", {
    //         prods: products,
    //         pageTitle: "Admin Panel - All Products",
    //         path: "/admin/products"
    //     });
    // }).catch(err => console.log(err));
}

