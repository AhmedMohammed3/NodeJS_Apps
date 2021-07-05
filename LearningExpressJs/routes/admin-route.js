const express = require("express");
const path = require("path");
const router = express.Router();

const adminController = require('../controllers/admin-controller')

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.get("/products/edit-product/:productID", adminController.getProduct);

router.post("/products/edit-product/:productID", adminController.postEditProduct);

router.post("/add-product", adminController.postAddProduct);

module.exports = router;
