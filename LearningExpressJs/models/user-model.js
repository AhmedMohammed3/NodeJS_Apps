const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');
class User {
    constructor(username, email, cart, _id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = _id ? new ObjectId(_id) : null;
    }

    save() {
        const db = getDB();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('user').updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOp = db.collection('user').insertOne(this);
        }
        return dbOp;
    }
    static findByID(userID) {
        const db = getDB();
        return db.collection('user').findOne({ _id: new ObjectId(userID) });
    }

    static fetchAll() {
        const db = getDB();
        return db.collection('user').find().toArray();
    }

    static deleteByID(userID) {
        const db = getDB();
        return db.collection('user').deleteOne({ _id: new ObjectId(userID) });
    }

    //==================Cart=Object======================
    deleteFromCart(prodID) {
        const db = getDB();
        const updatedCartItems = this.cart.items.filter(item => item.productID.toString() !== prodID.toString());
        console.log("this.cart.items", this.cart.items);
        console.log("updatedCart", updatedCartItems);
        return db.collection('user').updateOne({ _id: this._id }, { $set: { cart: { items: updatedCartItems } } });
    }

    addToCart(prodID) {
        const cartProductIndex = this.cart.items.findIndex(cartProduct =>
            cartProduct.productID.toString() === prodID.toString()
        );
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productID: new ObjectId(prodID), quantity: newQuantity });
        }
        const updatedCart = { items: updatedCartItems };
        const db = getDB();
        return db.collection('user').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDB();
        const productIDs = this.cart.items.map(item => item.productID);
        return db.collection('product').find({ _id: { $in: productIDs } }).toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(i => i.productID.toString() === product._id.toString()).quantity
                    }
                })
            });
    }
    //=====================================================
    //==================Order=Object======================
    addOrder() {
        const db = getDB();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name
                    }
                };
                return db.collection('order').insertOne(order)
            })
            .then(_ => {
                this.cart = { items: [] };
                return db.collection('user').updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
            })
            .catch(err => console.log(err))
    }

    getOrders() {
        const db = getDB();
        return db.collection('order').find({ 'user._id': new ObjectId(this._id) }).toArray();
    }
    //=====================================================

}
module.exports = User;