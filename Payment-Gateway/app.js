const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('./models/user');
const error = require('./middleware/error');
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
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(sessionMiddleware);

// Flash Messages Middleware
app.use(flash());

app.use(fileUploadMiddleware);
app.use(csrfMiddleware);
app.use(globalVarsMiddleware);


// Route to provide the CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

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
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling Middleware
app.use(error);

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