const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash'); // For flash messages
const User = require('./models/user');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my secret', // Use an environment variable for better security
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

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

app.use(csrfProtection); // CSRF middleware must come after the session middleware
app.use(flash());

// Global Variables for Views
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

// Error Handling Middleware
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