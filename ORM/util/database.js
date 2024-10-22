const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-orm-app', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
