const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mysecret', // Use a secure secret
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

// CSRF Middleware
app.use(csrfProtection);

// Flash Middleware
app.use(flash());

// Set default parameters for views
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Set CSRF token
    res.locals.errorMessage = []; // Default empty error messages
    res.locals.oldInput = undefined; // Default old input as undefined
    next();
});

// Routes
const authRoute = require('./routes/auth');
app.use(authRoute);

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
    });
});

// Connect to the database and start the server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));