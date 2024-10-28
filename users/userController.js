const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Models
const User = require('./user');
const Article = require('../articles/article');
const Category = require('../categories/category');

// Middlewares
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users',  adminAuth, async (req, res) => {
    try {
        const categories = await Category.findAll();
        const articles = await Article.findAll();
        const users = await User.findAll();
        res.render('admin/users/index', { categories, articles, users });
    } catch (error) {
        console.error('Erro ao buscar categorias ou artigos:', error);
        res.status(500).send('Erro no servidor'); 
    }    
});

router.get('/admin/users/create', async (req, res) => {
    try {
        const categories = await Category.findAll();
        const articles = await Article.findAll();
        res.render('admin/users/create', { categories, articles });
    } catch (error) {
        console.error('Erro ao buscar categorias ou artigos:', error);
        res.status(500).send('Erro no servidor');
    }
});

router.post('/users/create', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || email.trim() === "" || !password || password.trim() === "") {
        return res.redirect('/admin/users/create');
    }
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/admin/users');
            }).catch(err => {
                res.redirect('/admin/users/create');
            });    
        } else {
            res.redirect('/admin/users/create');
        }
    }); 
});

router.get('/login', async (req, res) => {
    try {
        const categories = await Category.findAll();
        const articles = await Article.findAll();
        const users = await User.findAll();
        res.render('admin/users/login', { categories, articles, users });
    } catch (error) {
        console.error('Erro ao buscar categorias ou artigos:', error);
        res.status(500).send('Erro no servidor'); 
    }
});

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password, user.password);
            
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                };  
                res.redirect('/admin/articles');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
});

module.exports = router;
