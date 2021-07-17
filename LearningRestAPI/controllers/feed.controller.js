const { validationResult } = require('express-validator');
const { handleError, throwError } = require('../helpers/error.helper.js');
const { clearImage } = require('../helpers/file.helper.js');

const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');


// GET /feed/posts
exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Fetched posts successfully',
                posts: posts,
                totalItems: totalItems
            });
        })
        .catch(err => {
            handleError(err, next);
        });


};

// POST /feed/post
exports.createPost = (req, res, next) => {
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
    let creator;
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        creator: req.userId
    });
    post.save()
        .then(createdPost => {
            return User.findById(req.userId);
        })
        .then(user => {
            if (!user) {
                throwError('Could not find user', 404);
            }
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(updatedUser => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch(err => {
            handleError(err, next);
        });
}
// GET /feed/post
exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                throwError('Could not find post', 404);
            }
            res.status(200).json({ message: 'Post Fetched', post: post });
        })
        .catch(err => {
            handleError(err, next);
        });
};

// PUT /feed/post

exports.updatePost = (req, res, next) => {
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
    Post.findById(postId)
        .then(post => {
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
            return post.save();
        })
        .then(updatedPost => {
            res.status(200).json({ message: 'Post Updated!', post: updatedPost })
        })
        .catch(err => {
            handleError(err, next);
        });
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                throwError('Could not find post', 404);
            }
            if (post.creator.toString() !== req.userId) {
                throwError('Unauthorized Delete', 403);
            }
            // check logged in user
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId)
        })
        .then(deletedPost => {
            return User.findById(req.userId);
        })
        .then(user => {
            if (!user) {
                throwError('Could not find user', 404);
            }
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted Post!' })
        })
        .catch(err => {
            handleError(err, next);
        });
}