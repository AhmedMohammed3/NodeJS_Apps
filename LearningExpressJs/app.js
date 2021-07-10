//==============Core Modules========
const path = require("path");
//==============Third Party=========
const express = require("express");
const mongoose = require('mongoose');
//==============My Code Files=======
const adminRoutes = require("./routes/admin-route");
const shopRoutes = require("./routes/shop-route");
const pageNotFoundRoute = require("./routes/404-route");
const routeDir = require("./util/path");
const User = require("./models/user-model");
//==================================
const app = express();

app.set("view engine", "ejs");

app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(routeDir, "public")));

app.use((req, res, next) => {
    User.findById('60e850ed599bff09a844c04d')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundRoute);

mongoose.connect(
    "mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/lolshop?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'hassan',
                    email: 'hassan@lol.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })

        console.log('Connected To DB');
        app.listen(1234)
    })
    .catch(err => console.log(err))