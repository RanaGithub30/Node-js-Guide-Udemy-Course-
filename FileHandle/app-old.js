const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash'); // For flash messages
const User = require('./models/user');
const multer = require('multer'); // for file handling
const fs = require('fs');
const upload = require('./util/fileUpload');

require('dotenv').config(); // Load environment variables

const app = express();

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

// CSRF Protection
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files first
app.use(bodyParser.urlencoded({ extended: false })); // Parse request body

// Session Middleware should be set before CSRF protection and user authentication
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        secure: false, // Set to true if using https
        sameSite: 'Lax' // You can also use 'None' for cross-site cookies (if using HTTPS)
      }
    })
);  

// CSRF Protection Middleware after session middleware
app.use(csrfProtection);
app.use(flash()); // Flash messages should come after session and csrf middleware

// File Upload Middleware (after csrf and flash, so we can safely handle the file)
// app.post('/upload', (req, res, next) => {
//   upload.single('image')(req, res, err => {
//     if (err) {
//       return res.status(400).send('Error during file upload: ' + err.message);
//     }
//     if (!req.file) {
//       return res.status(400).send('Invalid file type or no file uploaded');
//     }
//     res.send('File uploaded successfully!');
//   });
// });

// User Middleware (attach user to the request object after session is set)
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (user) {
        req.user = user; // Attach the user object to the request
      }
      next();
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

// Global Variables for Views (Make CSRF token and flash messages available to views)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.csrfToken = req.csrfToken(); // Makes CSRF token available in all views
  res.locals.errorMessage = req.flash('error'); // Pass flash error messages to views
  res.locals.successMessage = req.flash('success'); // Pass flash success messages to views
  next();
});

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error Handling Middleware (404)
app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  });
});

// Connect to the database and start the server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));