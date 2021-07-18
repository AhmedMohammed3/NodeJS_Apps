const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user.model');
const FeedController = require('../controllers/feed.controller');

describe('Feed Controller', function () {
    before(function (done) {
        const MONGODB_URI = "mongodb://hassanroot:root@cluster0-shard-00-00.vieeu.mongodb.net:27017,cluster0-shard-00-01.vieeu.mongodb.net:27017,cluster0-shard-00-02.vieeu.mongodb.net:27017/testlolbook?ssl=true&replicaSet=atlas-xvl5id-shard-0&authSource=admin&retryWrites=true&w=majority";
        mongoose.connect(MONGODB_URI,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
            .then(result => {
                const user = new User({
                    email: "test@test.com",
                    password: "tester",
                    name: "Test",
                    posts: [],
                });
                return user.save();
            })
            .then(_ => {
                done();
            })
    });

    it('Add created post to creator object', function (done) {

        const req = {
            body: {
                body: {
                    title: 'TitleTest',
                    content: 'ContentTest'
                },
                file: {
                    path: 'path/to/file'
                },
                userId: '5c0f66b979af55031b34728a'
            }
        };
        const res = {
            status: function () {
                return this;
            },
            json: function () {

            }
        };
        FeedController.createPost(req, res, () => { })
            .then(savedUser => {
                expect(savedUser).to.have.property('posts');
                expect(savedUser.posts).to.have.length(1);
                done();
            })
    })

    after(function (done) {
        User.deleteMany({})

            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            })
    })
});