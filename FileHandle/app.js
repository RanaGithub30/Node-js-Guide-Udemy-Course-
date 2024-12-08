const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('./models/user');
require('dotenv').config();

// Import Middleware
const sessionMiddleware = require('./middleware/session');
const csrfMiddleware = require('./middleware/csrf');
const fileUploadMiddleware = require('./middleware/fileUpload');
const globalVarsMiddleware = require('./middleware/globalVeriable');

const app = express();

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

// Flash Messages Middleware
app.use(flash());

app.use(fileUploadMiddleware);
app.use(csrfMiddleware);
app.use(globalVarsMiddleware);

// Attach User to Request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) {
        req.user = user; // Attach user object to request
      }
      next();
    })
    .catch((err) => {
      console.error(err);
      next();
    });
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
    isAuthenticated: req.session.isLoggedIn,
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
.catch((err) => console.error('Database connection error:', err));