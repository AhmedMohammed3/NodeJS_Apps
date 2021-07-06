// module.exports = function Product() {
const Sequelize = require('sequelize');

const db = require('../util/database');
// }

// const products = [];
//==============Core Modules========
// const fs = require('fs');
// const path = require('path');
//==============Third Party=========
//==============My Code Files=======
// const Cart = require('./cart-model');
// const db = require('../util/database');
//==================================

// const p = path.join(
//     path.dirname(require.main.filename),
//     'data',
//     'products.json',
// );
// const getProductsFromFile = (cb) => {

//     fs.readFile(p, (err, fileContent) => {
//         let products = [];
//         if (err) {
//             cb([]);
//         }
//         else {
//             cb(JSON.parse(fileContent));
//         }
//     });
// }

// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }
const Product = db.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
module.exports = Product;
//     // save() {
//     // products.push(this);
//     // getProductsFromFile(products => {
//     //     if (this.id) {
//     //         const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//     //         const updatedProducts = [...products];
//     //         updatedProducts[existingProductIndex] = this;
//     //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //             console.log(err);
//     //         });
//     //     } else {
//     //         this.id = Math.random().toString();
//     //         products.push(this);
//     //         fs.writeFile(p, JSON.stringify(products), (err) => {
//     //             console.log(err);
//     //         });
//     //     }
//     // });
//     // }
//     save() {
//         return db.execute('insert into product (title, price, description, imageUrl) values(?, ?, ?, ?);',
//             [this.title, this.price, this.description, this.imageUrl]
//         );
//     }

//     // static deleteById(id) {
//     // getProductsFromFile(products => {
//     //     const product = products.find(prod => prod.id === id);
//     //     const updatedProducts = products.filter(prod => prod.id !== id);
//     //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //         if (!err) {
//     //             Cart.deleteProduct(id, product.price);
//     //         }
//     //     });
//     // });
//     // }

//     // static fetchAll(cb) {
//     // getProductsFromFile(cb);
//     // }

//     static fetchAll() {
//         return db.execute('select * from product;');
//     }

//     // static findById(id, cb) {
//     // getProductsFromFile(products => {
//     //     const product = products.find(p => p.id === id);
//     //     cb(product);
//     // });
//     // }

//     static findById(id) {
//         return db.execute('select * from product where id=?', [id]);
//     }
// }