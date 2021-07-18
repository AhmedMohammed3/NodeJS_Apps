const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/auth.middleware');

describe('Auth Middleware', function () {
    it('Authorization Header Absence Error', function () {
        const req = {
            get: function (headerName) {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not Authenticated');
    });

    it('Authorization Header doesn\'t contain Bearer', function () {
        const req = {
            get: function (headerName) {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });

    it('Token can be verified', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer sldkjadnasdjakjhasdhjahjdkhsdjasd';
            }
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        authMiddleware(req, {}, () => { });
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it('Token can\'t be verified error', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });
})