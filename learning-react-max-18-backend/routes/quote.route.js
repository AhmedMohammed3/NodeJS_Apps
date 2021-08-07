const express = require('express');

const quoteController = require('../controllers/quote.controller');
const router = express.Router();

router.get('/quotes', quoteController.getQuotes);

router.get('/:quoteId', quoteController.getQuote);

router.post('/add-quote', quoteController.postQuote);

module.exports = router;
