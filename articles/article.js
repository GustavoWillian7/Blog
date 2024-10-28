const Sequelize = require('sequelize');
const connection = require('../db/db');
const Category = require('../categories/category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article, {foreignKey: 'category_id'});
Article.belongsTo(Category, {foreignKey: 'category_id'});

module.exports = Article;
