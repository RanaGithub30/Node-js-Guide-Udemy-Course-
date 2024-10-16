const http = require('http'); // this code import the http module
const express = require('express');
const path = require('path');
const rootDir = require('./helpers/path');
const errorController = require('./controllers/errorController');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const bodyParser = require('body-parser');

const app = express();

// set view template & folder

app.set('view engine', 'pug');
app.set('views', 'views/pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);