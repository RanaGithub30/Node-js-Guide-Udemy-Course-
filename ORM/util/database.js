const Sequelize = require('sequelize');

/**
 * Sequelize(dbName, user, password, extraInfo)
*/

const sequelize = new Sequelize('node-orm-app', 'root', '', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;