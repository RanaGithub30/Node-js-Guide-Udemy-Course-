const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const authController = require("../controllers/auth");

describe("Auth Controller - Login Test", function () {
    let token;
    let user;

  /** Initialize DB Connection before each test 
   * before --> hook used to access before every test cases
  */

  before(function (done) {
    mongoose
      .connect("mongodb://127.0.0.1:27017/test-db")
      .then(() => {
        return User.findOne({ email: "test.node@yopmail.com" });
      })
      .then((existingUser) => {
        if (existingUser) {
          return existingUser; // Return existing user
        }
  
        const newUser = new User({
          email: "test.node@yopmail.com",
          password: "test@node",
          name: "Test",
          age: "30",
          status: "",
          _id: new mongoose.Types.ObjectId(), // Use MongoDB ObjectId
        });
  
        return newUser.save(); // Save new user and return it
      })
      .then((savedUser) => {
        user = savedUser; // Assign globally

        // Generate JWT token
        token = jwt.sign(
          { userId: user._id.toString() },
          "supersecretkey", // Same secret used in auth middleware
          { expiresIn: "1h" }
        );
  
        done();
      })
      .catch((err) => {
        console.error("Database connection error:", err);
        done(err);
      });
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

  /** Test for Profile API */
  it("should return user profile data when authenticated", async function () {
    const req = {
      userId: user._id.toString(), // ✅ Now 'user' is accessible
    };
  
    const res = {
      statusCode: 500,
      data: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };
  
    await authController.profile(req, res, () => {}); // ✅ Call the profile controller
  
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.have.property("msg", "User Profile");
    expect(res.data.data).to.have.property("email", "test.node@yopmail.com");
  });  

  /** We can use after hook for global access of after each method */
});