// module.exports = function Product() {

// }

// const products = [];
//==============Core Modules========
const fs = require('fs');
const path = require('path');
//==============Third Party=========
//==============My Code Files=======
const Cart = require('./cart-model');
//==================================

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json',
);
const getProductsFromFile = (cb) => {

    fs.readFile(p, (err, fileContent) => {
        let products = [];
        if (err) {
            cb([]);
        }
        else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        // products.push(this);
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }


    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}