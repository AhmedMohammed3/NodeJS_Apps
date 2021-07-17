const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed.route');
const authRoutes = require('./routes/auth.route');

const MONGODB_URI = "mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/lolbook?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority";


const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random() * 10000 + "-" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
// app.use(express.urlencoded()); // this is for data of type application/x-www-form-urlencoded
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.json()); // this is for data of type application/json
app.use('/images', express.static(path.join(__dirname, "images")));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);



app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({ message: err.message, data: err.data ? err.data : undefined });
});

mongoose.connect(MONGODB_URI,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(result => {
        app.listen(1234);
        console.log('Server is listening on port 1234');
    })
    .catch(err => console.log(err)
    )
