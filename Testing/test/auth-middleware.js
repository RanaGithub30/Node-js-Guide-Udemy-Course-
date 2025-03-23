const { expect } = require("chai");
const auth = require("../middlewares/isAuth");

describe("Auth Middleware", function () {
    it("should set req.isAuth to false if no Authorization header is present", function () {
        const req = {
            get: function () {
                return null; // Simulating missing Authorization header
            }
        };

        const next = function () {};

        auth(req, {}, next);

        expect(req.isAuth).to.be.false;
    });

    it("should set req.isAuth to false if token verification fails", function () {
        const req = {
            get: function () {
                return "Bearer invalidtoken"; // Simulating invalid token
            }
        };

        const next = function () {};

        auth(req, {}, next);

        expect(req.isAuth).to.be.false;
    });

    it("should set req.isAuth to true and add userId if token is valid", function () {
        const jwt = require("jsonwebtoken");
        const fakeToken = jwt.sign({ userId: "12345" }, "supersecretkey");

        const req = {
            get: function () {
                return `Bearer ${fakeToken}`; // Simulating a valid token
            }
        };

        const next = function () {};

        auth(req, {}, next);

        expect(req.isAuth).to.be.true;
        expect(req.userId).to.equal("12345");
    });
});