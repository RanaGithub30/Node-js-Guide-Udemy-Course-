const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Use the imported session middleware
app.use(sessionMiddleware);

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const userRoutes = require('./routes/user');
// const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make isAuthenticated available in all views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/user', userRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 3000;

// Connect to the database and start the server
mongoose.connect(process.env.MONGO_URI).then(result => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));