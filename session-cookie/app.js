const path = require('path');
// const connectDB = require('./util/database').mongoConnect;
const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Load environment variables (if using dotenv)
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/user', userRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 3000;

// Connect to the database
mongoose.connect(process.env.MONGO_URI).then(result => {
    app.listen(3000);
}).catch(err => console.log(err));