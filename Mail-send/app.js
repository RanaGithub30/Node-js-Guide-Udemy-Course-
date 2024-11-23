const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const mailRoute = require('./routes/mail');
app.use(mailRoute);

app.listen(3000);