const express = require("express");
const path = require("path");
const router = express.Router();

const adminController = require('../controllers/admin-controller')

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:productID", adminController.getEditProduct);

router.post("/edit-product/", adminController.postEditProduct);

router.post("/delete-product/", adminController.postDeleteProduct);


module.exports = router;
