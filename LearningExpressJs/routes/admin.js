const express = require("express");
const path = require("path");
const { title } = require("process");

const routeDir = require("../util/path");
const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(routeDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Admin Panel - Add Products",
    path: "admin/add-product",
  });
});

router.post("/add-product", (req, res, next) => {
  products.push(req.body);
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
