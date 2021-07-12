//==============Core Modules========
const path = require("path");
//==============Third Party=========
const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
//==============My Code Files=======
const adminRoutes = require("./routes/admin-route");
const shopRoutes = require("./routes/shop-route");
const authRoutes = require('./routes/auth-route');
const errorRoute = require("./routes/error-route");
const routeDir = require("./util/path");
const User = require("./models/user-model");
//==================================
const MONGODB_URI = "mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/lolshop?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
},
    (err) => {
        if (err) console.log("Error Connecting to Mongodb server");
    }
);

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        try {
            callback(null, 'image' + Math.random() * 100000 + '-' + file.originalname);
        }
        catch (err) {
            console.log(err);
        }
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
}

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(routeDir, "public")));
app.use('/images', express.static(path.join(routeDir, "images")));
app.use(session({
    secret: 'This is a long line value for the hashing of session id',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoute);

app.use((error, req, res, next) => {
    res.status(500).render("500", {
        pageTitle: "Server Error",
        path: "/500",
    });
})
mongoose.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
)
    .then(result => {
        console.log('Connected To DB');
        app.listen(1234)
    })
    .catch(err => {
        console.log("Error Connecting to Mongodb server");
        app.listen(1234);
    })