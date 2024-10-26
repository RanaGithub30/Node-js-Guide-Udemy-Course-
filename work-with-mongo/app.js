const path = require('path');
const connectDB = require('./util/database');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Load environment variables (if using dotenv)
require('dotenv').config();

// Connect to the database
connectDB();

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 3000;
// app.listen(3000);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});