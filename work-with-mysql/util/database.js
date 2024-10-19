const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-app-1',
    password: ''
});

module.exports = pool.promise();