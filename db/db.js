const Sequelize = require('sequelize');

const connection = new Sequelize('blog', 'root', 'Undefined&2mconfused', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;
