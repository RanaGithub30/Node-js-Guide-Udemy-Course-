const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

// Set `isAuthenticated` for all views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; // or however you determine if a user is logged in
    next();
});  

const PORT = process.env.PORT || 3000;

// Connect to the database and start the server
mongoose.connect(process.env.MONGO_URI).then(result => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));