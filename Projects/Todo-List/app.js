const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const error = require('./controllers/error');
const gv = require('./middlewares/globalVeriables');
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
app.use(flash());
app.use(gv);

// Routes
const authRoute = require('./routes/auth');
app.use(authRoute);

// 404 Middleware
app.use(error.get404);

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