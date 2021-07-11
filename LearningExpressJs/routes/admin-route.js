const express = require("express");
const path = require("path");
const router = express.Router();

const adminController = require('../controllers/admin-controller')
const isAuth = require('../middlwares/is-auth-middleware');


router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product/", isAuth, adminController.postEditProduct);

router.post("/delete-product/", isAuth, adminController.postDeleteProduct);

module.exports = router;
