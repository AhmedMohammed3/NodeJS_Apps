// module.exports = function Product() {

// }

// const products = [];
//==============Core Modules========
const fs = require('fs');
const path = require('path');
//==============Third Party=========
//==============My Code Files=======
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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id == null ? this.id = Math.random().toString() : this.id;
        // products.push(this);
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
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