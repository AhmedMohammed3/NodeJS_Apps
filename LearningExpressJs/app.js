//==============Core Modules========
//==============Third Party=========
const express = require("express");
const path = require("path");
//==============My Code Files=======
const adminRoutes = require("./routes/admin-route");
const shopRoutes = require("./routes/shop-route");
const pageNotFoundRoute = require("./routes/404-route");
const routeDir = require("./util/path");
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

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundRoute);

app.listen(1234);
