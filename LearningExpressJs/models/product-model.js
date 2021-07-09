const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

class Product {
    constructor(title, price, imageUrl, description, _id, userID) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = _id ? ObjectId(_id) : null;
        this.userID = userID;
    }

    save() {
        const db = getDB();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('product').updateOne({ _id: this._id }, { $set: this });
        }
        else {
            dbOp = db.collection('product').insertOne(this);
        }
        return dbOp;
    }

    static fetchAll() {
        const db = getDB();
        return db.collection('product').find().toArray();
    }
    static findByID(productID) {
        const db = getDB();
        return db.collection('product').findOne({ _id: new ObjectId(productID) });
    }
    static deleteByID(productID) {
        const db = getDB();
        return db.collection('product').deleteOne({ _id: new ObjectId(productID) });
    }
}

module.exports = Product;