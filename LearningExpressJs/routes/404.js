const express = require("express");
const path = require("path");
const routeDir = require("../util/path");

const router = express.Router();

router.use((req, res, next) => {
  // res.status(404).sendFile(path.join(routeDir, "views", "404.html"));
  res.status(404).render("404", {pageTitle: "Page Not Found"});
});

module.exports = router;
