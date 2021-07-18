const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user.model');
const AuthController = require('../controllers/auth.controller');

describe('Auth Controller', function () {
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

    it('Access Database Fails error', function () {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };
        AuthController.postLogin(req, {}, () => { })
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 401);
                // done(); // also add done argument
            })

        User.findOne.restore();
    })
    it('send a response with valid user status for an existing user', function (done) {

        const req = {
            userId: '5c0f66b979af55031b34728a'
        };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, () => { })
            .then(_ => {
                expect(res.statusCode).to.equal(200);
                expect(res.userStatus).to.equal('I am new');
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