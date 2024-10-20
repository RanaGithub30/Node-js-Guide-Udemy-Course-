const Sequelize = require('sequelize');
const db = require('../util/database');

const Cart = db.define('carts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    prod_id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
    }
});

module.exports = Cart;