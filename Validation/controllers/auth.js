const crypto = require('crypto'); // a builtin libtrary to help us generate a secure random values
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  // let message = req.flash('error');
  // if(message.length > 0){
  //     message = message[0]
  // }else{
  //     message = null;
  // }

  const errors = validationResult(req);
  const message = errors.array();

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    csrfToken: req.csrfToken()
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()
    });
  }

  User.findOne({email: email})
    .then(user => {
      if(!user){
        req.flash('error', 'Invalid Email or Password');
        return res.redirect('/login');
      }

      // compare the password
      bcrypt.compare(password, user.password)
      .then(doMatch => {

        // if password matched
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }

        return res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
        return res.redirect('/login');
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
      return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()
    });
  }

  User.findOne({email: email})
  .then(userDoc => {
    if(userDoc){
      return res.redirect('/signup');
    }else{
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
      
          return user.save();
        })
        .then(result => {
          return res.redirect('/');
        });
    }
  })
  .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

/**
 * Reset/Forget Password
*/

exports.resetPassword = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
      message = message[0]
  }else{
      message = null;
  }

  res.render('auth/reset-password', {
    pageTitle: "Forget Password",
    path: "/reset/password",
    errorMessage: message
  });
}

// working here......


exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if(err){
        console.log(err);
        return res.redirect('/reset/password');
    }

    // generate token
    const token = buffer.toString('hex');
    User.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('error', 'No User Account Found with this Email');
            return res.redirect('/reset/password');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 3600000 in ms ==> 1 hour
        return user.save(); 
    })
    .then(result => {

      // Send the reset email
      const resetLink = `http://localhost:3000/reset/password/${token}`; // Replace with your domain in production

      // Set up the email
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Use your email service provider
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER, // Replace with your credentials
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        to: email,
        from: 'no-reply@example.com', // Replace with your sender email
        subject: 'Password Reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you didn't request this, please ignore this email.</p>
        `
      };

      transporter.sendMail(mailOptions);
      return res.redirect('/reset/password');
    })
    .catch(err => {
      console.log(err);
    });
  });
}

exports.newPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else{
        message = null;
    }
  
    res.render('auth/new-password', {
      pageTitle: "New Password",
      path: "/new/password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  })
  .catch(err => {
    console.log(err);
  });
}

exports.updateNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
  .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    return res.redirect('/');
  })
  .catch(err => {
    console.log(err)
  });
}