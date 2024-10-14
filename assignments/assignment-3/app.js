/**
 * Create a application where two url will be there one is / & another is /users, where in / url user will provide their name & the 
 * details will be show in /users url
*/

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const mainRoute = require('./routes/main');

app.set('view engine', 'pug');
app.set('views', 'views/pug');

app.use(mainRoute.routes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.render('404', {path: '404', pageTitle: '404'});
});

app.listen(3000);