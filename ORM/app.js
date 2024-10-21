const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');

const db = require('./util/database');

/** Define relationship */
User.hasMany(Product);
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

/** Execute to create the db tables that are define in the sequelize model */
db.sync().
// sync({force: true})
then(result => console.log(result)).
catch(err => console.log(err));

const app = express();

/** Add a middleware to define user relation */
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err))
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(cartRoutes);

app.use(errorController.get404);

app.listen(3000);