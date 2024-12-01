const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/signin");
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.psw;
  const psw_repeat = req.body.psw_repeat;

  // Check if passwords match
  if (psw_repeat !== password) {
    return res.status(422).render("auth/signup", {
      errorMessage: [{ msg: "Password & Repeat Password Must Match" }],
      oldInput: { name, email, password, psw_repeat },
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array(),
      oldInput: { name: name, email: email, psw: password, psw_repeat: psw_repeat },
    });
  }

  // Check if the email is already registered
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(422).render("auth/signup", {
          errorMessage: [
            {
              msg: "You Have Already Registered With This Email, Please Login",
            },
          ],
          oldInput: { name, email, password, psw_repeat },
        });
      }

      // Hash the password and create a new user
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });
          return newUser.save();
        })
        .then((result) => {
          // Redirect to login page after successful registration
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render("auth/signup", {
        errorMessage: [
          { msg: "An unexpected error occurred. Please try again later." },
        ],
        csrfToken: req.csrfToken(),
        oldInput: { name, email, password, psw_repeat },
      });
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const psw = req.body.psw;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signin", {
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array(),
      oldInput: { email: email, psw: psw },
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/signin", {
          isAuthenticated: false,
          csrfToken: req.csrfToken(),
          errorMessage: [{ msg: "Invalid Email or Password" }],
          oldInput: { email: email, psw: psw },
        });
      }

      // compare the password
      bcrypt
        .compare(psw, user.password)
        .then((doMatch) => {
          // if password matched
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return res.redirect("/dashboard");

            return req.session.save((err) => {
              res.redirect("/");
            });
          }

          return res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.dashboard = (req, res, next) => {
    res.render("auth/dashboard", {
        isAuthenticated: true,
        csrfToken: req.csrfToken(),
        user: req.session.user,
    });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};