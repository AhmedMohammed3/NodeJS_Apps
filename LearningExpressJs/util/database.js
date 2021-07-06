// const mysql = require('mysql2');

const Sequelize = require('sequelize');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'learningnode',
//     password: 'root'
// });


// module.exports = pool.promise();

const sequelize = new Sequelize('learningnode', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;