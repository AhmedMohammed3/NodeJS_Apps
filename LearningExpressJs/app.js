//==============Core Modules========
//==============Third Party=========
const express = require("express");
const path = require("path");
//==============My Code Files=======
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const pageNotFoundRoute = require("./routes/404");
const routeDir = require("./util/path");
//==================================
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(routeDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundRoute);

app.listen(1234);
