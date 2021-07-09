//==============Core Modules========
//==============Third Party=========
const express = require("express");
const path = require("path");
//==============My Code Files=======
const adminRoutes = require("./routes/admin-route");
const shopRoutes = require("./routes/shop-route");
const pageNotFoundRoute = require("./routes/404-route");
const routeDir = require("./util/path");
const { mongoConnect } = require("./util/database");
const User = require("./models/user-model");
//==================================
const app = express();

app.set("view engine", "ejs");

app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(routeDir, "public")));

app.use((req, res, next) => {
    User.findByID('60e79a9171fd7cc39169d832')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundRoute);

mongoConnect(() => {
    app.listen(1234);
});