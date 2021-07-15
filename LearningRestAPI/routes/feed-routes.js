const express = require('express');

const feedControllers = require('../controllers/feed-controllers');
const router = express.Router();

// GET /feed/posts
router.get('/posts', feedControllers.getPosts);

// POST /feed/post
router.post('/post', feedControllers.createPost);
module.exports = router;