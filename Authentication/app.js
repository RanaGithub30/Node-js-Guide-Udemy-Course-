const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash'); // For Flash message

require('dotenv').config();

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection); // CSRF middleware must be after the session middleware
app.use(flash());

// Pass CSRF token and authentication info to all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.csrfToken = req.csrfToken(); // Makes csrfToken available in all views
  next();
});

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error Handling
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', isAuthenticated: req.session.isLoggedIn });
});

const PORT = process.env.PORT || 3000;

// Connect to the database and start the server
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log(err));