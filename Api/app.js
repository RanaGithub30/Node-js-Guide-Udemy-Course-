const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const headerMiddlewares = require('./middlewares/headers');
require('dotenv').config();

const app = express();

// Parse application/json
app.use(express.json());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Flash Messages Middleware
app.use(flash());

// for CROS Issue Solve
app.use(headerMiddlewares);

const feedRoute = require('./routes/feed');
app.use('/api/v1/feed/', feedRoute);

const PORT = process.env.PORT || 3000;

mongoose
.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('Database connection error:', err));