const { expect } = require("chai");
const sinon = require('sinon');

const User = require('../models/user');
const authController = require('../controllers/auth');

describe('Auth Controller - Login Test', function(){
    it('Throws error if accessing database fails', function(){
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        /** Create a dummy request object */
        const req = {
            body: {
                "email" : "testing@yopmail.com",
                "password" : "12345"
            }
        };

        // Test Async Code
        authController.signin(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });
    });
});