const Sequelize = require('sequelize');
const connection = require('../db/db');

const User = connection.define('Users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;
