const { validationResult } = require('express-validator');
const { handleError, throwError } = require('../helpers/error.helper.js');
const { clearImage } = require('../helpers/file.helper.js');

const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');


// GET /feed/posts
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        let totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
            .populate('creator')
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res.status(200).json({
            message: 'Fetched posts successfully',
            posts: posts,
            totalItems: totalItems
        });
    }
    catch (err) {
        handleError(err, next);
    }
};

// POST /feed/post
exports.createPost = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwError('Validation failed, entered data is incorrect.', 422);
    }
    if (!req.file) {
        throwError('No image Provided!', 422);
    }
    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        creator: req.userId
    });
    try {
        await post.save();
        const creator = await User.findById(req.userId);
        if (!creator) {
            throwError('Could not find user', 404);
        }
        creator.posts.push(post);
        const savedUser = await creator.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: {
                _id: creator._id,
                name: creator.name
            }
        });
        return savedUser;
    }
    catch (err) {
        handleError(err, next);
    };
}
// GET /feed/post
exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    try {
        if (!post) {
            throwError('Could not find post', 404);
        }
        res.status(200).json({ message: 'Post Fetched', post: post });
    } catch (err) {
        handleError(err, next);
    };
};

// PUT /feed/post

exports.updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwError('Validation failed, entered data is incorrect.', 422);
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
        throwError('No image Provided!', 422);
    }
    try {
        const post = await Post.findById(postId)
        if (!post) {
            throwError('Could not find post', 404);
        }
        if (post.creator.toString() !== req.userId) {
            throwError('Unauthorized', 403);
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const updatedPost = await post.save();
        res.status(200).json({ message: 'Post Updated!', post: updatedPost })
    }
    catch (err) {
        handleError(err, next);
    };
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId)
        if (!post) {
            throwError('Could not find post', 404);
        }
        if (post.creator.toString() !== req.userId) {
            throwError('Unauthorized Delete', 403);
        }
        // check logged in user
        clearImage(post.imageUrl);
        const deletedPost = await Post.findByIdAndRemove(postId)
        const user = await User.findById(req.userId);
        if (!user) {
            throwError('Could not find user', 404);
        }
        user.posts.pull(postId);
        const result = await user.save();
        res.status(200).json({ message: 'Deleted Post!' })
    } catch (err) {
        handleError(err, next);
    };
}