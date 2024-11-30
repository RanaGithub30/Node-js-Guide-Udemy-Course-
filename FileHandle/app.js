const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const User = require('./models/user');
const globalVariables = require('./middleware/globalVeriable');
const errorController = require('./controllers/error');
const upload = require('./util/fileUpload-old');
const csrfMiddleware = require('./middleware/csrfMiddleware');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

// CSRF Protection
const csrfProtection = csrf();

// View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// File Upload Middleware
app.use(upload.any());

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

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my_secret_key', // Use a secure secret
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// CSRF Middleware
app.use(csrfMiddleware.csrfProtection);
app.use(csrfMiddleware.addCsrfToken);
app.use(csrfMiddleware.csrfErrorHandler);

// Flash Messages
app.use(flash());

// Global Variables Middleware
app.use(globalVariables);

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 Error Handling Middleware
app.use(errorController.get404);

// Connect to MongoDB and Start the Server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));