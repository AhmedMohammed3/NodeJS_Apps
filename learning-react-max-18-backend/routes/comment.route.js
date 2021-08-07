const express = require('express');

const commentController = require('../controllers/comment.controller');
const router = express.Router();

router.post('/:quoteId', commentController.postComment);

router.get('/:quoteId', commentController.getComments);

module.exports = router;
