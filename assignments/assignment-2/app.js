/**
 * create a express app with two different routes / & /users that will render html page in server
*/

const express = require('express');
const rootDir = require('./helpers/path');
const path = require('path');

const app = express();

const allRoute = require('./routes/all');
app.use(allRoute);

app.use(express.static(path.join(rootDir, 'public')));

/** 404 page */
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', 'errors', '404.html'));
});

app.listen(3000);