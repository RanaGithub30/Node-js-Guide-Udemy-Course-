const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const authController = require("../controllers/auth");

describe("Auth Controller - Login Test", function () {
  /** Initialize DB Connection before each test 
   * before --> hook used to access before every test cases
  */
 
  before(function (done) {
    mongoose
      .connect("mongodb://127.0.0.1:27017/test-db")
      .then((result) => {
        const user = new User({
          email: "test.node@yopmail.com",
          password: "test@node",
          name: "Test",
          age: "30",
          status: "",
          _id: "6736f296c16b567f30b5480f",
        });

        return user.save();
      })
      .then(() => {
        done();
      })
      .catch((err) => console.error("Database connection error:", err));
  });

  it("Throws error if accessing database fails", function () {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    /** Create a dummy request object */
    const req = {
      body: {
        email: "testing@yopmail.com",
        password: "12345",
      },
    };

    // Test Async Code
    authController
      .signin(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });

    User.findOne.restore();
  });

  /** Setting up a Testing DB */
  it("should send a response with a valid user status for an existing user", function () {
    const req = { userId: "6736f296c16b567f30b5480f" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    authController
      .signup(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        })
          .catch((err) => console.error("Database connection error:", err));
      });
  });

  /** We can use after hook for global access of after each method */
});