const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

// DB
const connection = require("./db/db");

// Controllers
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const userController = require("./users/userController");

// Models
const Article = require("./articles/article");
const Category = require("./categories/category");
const User = require("./users/user");

// View engine
app.set("view engine", "ejs");

// Sessions
app.use(session({
    secret: "S3nh4s3cr3t4",
    cookie: {
        maxAge: 3600000
    },
    resave: false,
    saveUninitialized: true
}));

// Static
app.use(express.static("public"));

// Body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Database
connection.authenticate().then(() => {
    console.log("Connection has been established successfully.");
}).catch((err) => {
    console.error("Unable to connect to the database:", err);
});

// Routes
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', userController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll({}).then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll({}).then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then((category) => {
        if (category != undefined) {
            Category.findAll({}).then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
