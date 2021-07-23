const env = require('./env');

exports.MONGODB_URI = `mongodb://${env.DB_USER
    }:${env.DB_PASS
    }@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/${env.DB_NAME
    }?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority`;