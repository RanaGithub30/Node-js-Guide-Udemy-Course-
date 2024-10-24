const sequelize = require('sequelize');
const db = require('../util/database');

const Order = db.define('orders', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

});

module.exports = Order;