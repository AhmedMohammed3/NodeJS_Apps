//==============Core Modules========
//==============Third Party=========
const express = require("express");
const path = require("path");
const expressHbs = require("express-handlebars");
//==============My Code Files=======
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const pageNotFoundRoute = require("./routes/404");
const routeDir = require("./util/path");
//==================================
const app = express();

app.engine(
  "hbs",
  expressHbs({
    extname: "hbs",
    defaultLayout: false,
  })
);
app.set("view engine", "hbs");

// app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(routeDir, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use(pageNotFoundRoute);

app.listen(1234);
