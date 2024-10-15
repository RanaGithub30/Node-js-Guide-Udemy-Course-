const http = require('http'); // this code import the http module
const express = require('express');
const path = require('path');
const rootDir = require('./helpers/path');

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

app.use((req, res, next) => {
    res.render('404', {path: '404', pageTitle: '404'});
    // res.status(404).sendFile(path.join(rootDir, 'views', 'errors', '404.html'));
});

app.listen(3000);