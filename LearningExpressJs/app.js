//==============Core Modules========
//==============Third Party=========
const express = require("express");
const path = require("path");
//==============My Code Files=======
const adminRoutes = require("./routes/admin-route");
const shopRoutes = require("./routes/shop-route");
const pageNotFoundRoute = require("./routes/404-route");
const routeDir = require("./util/path");
const db = require('./util/database');
const Product = require('./models/product-model');
const User = require('./models/user-model');
//==================================
const app = express();

// app.engine(
//   "hbs",
//   expressHbs({
//     extname: "hbs",
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//   })
// );
app.set("view engine", "ejs");

// app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(routeDir, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundRoute);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// db.sync({ force: true })
db.sync()
    .then(_ => User.findByPk(1))
    .then(user => {// TODO: Remove this dummy user
        if (!user) {
            return User.create({ name: 'Hassan', email: 'hassan@lol.com' });
        }
        return user;
    }).then(user => {
        app.listen(1234);
    })
    .catch(err => console.log(err));


