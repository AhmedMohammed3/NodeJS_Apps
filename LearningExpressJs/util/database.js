const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const uri = "mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/lolshop?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority";
const mongoConnect = callback => {
    MongoClient.connect(uri, { useUnifiedTopology: true })
        .then(client => {
            console.log('Connected To Database');
            _db = client.db();
            callback();
        }
        )
        .catch(err => {
            console.log(err)
        });
}

const getDB = () => {
    if (_db) {
        return _db;
    }
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;