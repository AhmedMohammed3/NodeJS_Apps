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
    constructor(title) {
        this.title = title;
    }

    save() {
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
}