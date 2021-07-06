//==============Core Modules========
// const fs = require('fs');
// const path = require('path');
//==============Third Party=========
const Sequelize = require('sequelize');
//==============My Code Files=======
const db = require('../util/database');
//==================================
const Cart = db.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;
// const p = path.join(
//     path.dirname(require.main.filename),
//     'data',
//     'cart.json',
// );

// module.exports = class Cart {
//     static addProduct(id, productPrice) {
//         // Fetch the previous cart
//         fs.readFile(p, (err, fileContent) => {
//             let cart = { products: [], totalPrice: 0 }
//             if (!err) {
//                 cart = JSON.parse(fileContent);
//             }
//             // Analyze the cart => Find existing product
//             const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
//             const existingProduct = cart.products[existingProductIndex];
//             let updatedProduct;
//             // Add new product / increase the quantity
//             if (existingProduct) {
//                 updatedProduct = { ...existingProduct };
//                 updatedProduct.qty += 1;
//                 // cart.products = [...cart.products];
//                 cart.products[existingProductIndex] = updatedProduct;
//             }
//             else {
//                 updatedProduct = { id: id, qty: 1 };
//                 cart.products = [...cart.products, updatedProduct];
//             }
//             cart.totalPrice = cart.totalPrice + +productPrice;
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 console.log(err);
//             });
//         });

//     }
//     // constructor() {
//     //     this.products = [];
//     //     this.totalPrice = 0;
//     // }

//     static deleteProduct(id, productPrice) {
//         fs.readFile(p, (err, fileContent) => {
//             if (err) {
//                 return;
//             }
//             const updatedCart = { ...JSON.parse(fileContent) };
//             console.log("p", p);
//             console.log("updatedCart", updatedCart);
//             const product = updatedCart.products.find(prod => prod.id === id);
//             if (!product) {
//                 return;
//             }
//             const productQty = product.qty;
//             updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
//             updatedCart.totalPrice -= productPrice * productQty;

//             fs.writeFile(p, JSON.stringify(updatedCart), err => {
//                 console.log(err);
//             })
//         });
//     }

//     static getCart(cb) {
//         fs.readFile(p, (err, fileContent) => {
//             const cart = JSON.parse(fileContent);
//             if (err) {
//                 cb(null);
//             }
//             else {
//                 cb(cart);
//             }
//         });
//     }
// }

