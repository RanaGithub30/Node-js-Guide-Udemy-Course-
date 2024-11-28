const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/signin');
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup');
}

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.psw;
    const psw_repeat = req.body.psw_repeat;

    // Check if passwords match
    if (psw_repeat !== password) {
        return res.status(422).render('auth/signup', {
            errorMessage: [{ msg: "Password & Repeat Password Must Match" }],
            oldInput: { name, email, password, psw_repeat },
        });
    }

    // Check if the email is already registered
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(422).render('auth/signup', {
                    errorMessage: [{ msg: "You Have Already Registered With This Email, Please Login" }],
                    oldInput: { name, email, password, psw_repeat },
                });
            }

            // Hash the password and create a new user
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                    });
                    return newUser.save();
                })
                .then(result => {
                    // Redirect to login page after successful registration
                    res.redirect('/');
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).render('auth/signup', {
                errorMessage: [{ msg: "An unexpected error occurred. Please try again later." }],
                csrfToken: req.csrfToken(),
                oldInput: { name, email, password, psw_repeat },
            });
        });
};