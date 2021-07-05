const express = require("express");
const path = require("path");
const router = express.Router();

const adminController = require('../controllers/admin-controller')

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

module.exports = router;
