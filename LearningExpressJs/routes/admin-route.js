const express = require("express");
const { check, body } = require('express-validator');
const router = express.Router();

const adminController = require('../controllers/admin-controller')
const isAuth = require('../middlwares/is-auth-middleware').isAuth;


router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth,
    [
        check('title')
            .not().isEmpty()
            .withMessage('You can\'t add a product without a Title')
        // ,
        // check('imageUrl')
        //     .not().isEmpty()
        //     .withMessage('You can\'t add a product without an Image')
        //     .isURL()
        //     .withMessage('Image URL must be valid')
        ,
        check('price')
            .not().isEmpty()
            .withMessage('You can\'t add a product without a Price')
            .isFloat()
            .withMessage('Price must be a sort of numbers')
        ,
        check('description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Description has to be atleast 5 characters long and not exceed 400 characters')
        ,
    ],
    adminController.postAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product/", isAuth,
    [
        body('title')
            .not().isEmpty()
            .withMessage('You can\'t add a product without a Title'),
        // body('imageUrl')
        //     .not().isEmpty()
        //     .withMessage('You can\'t add a product without an Image')
        //     .isURL()
        //     .withMessage('Image URL must be valid'),
        body('price')
            .not().isEmpty()
            .withMessage('You can\'t add a product without a Price')
            .isNumeric()
            .withMessage('Price must be a sort of numbers'),
        body('description')
            .not().isEmpty()
            .withMessage('You can\'t add a product without a Description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Description has to be atleast 5 characters long and not exceed 400 characters'),
    ],
    adminController.postEditProduct);

router.delete("/product/:productID", isAuth, adminController.deleteProduct);

module.exports = router;
