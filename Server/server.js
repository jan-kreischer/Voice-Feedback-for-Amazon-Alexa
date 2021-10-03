require('dotenv').config();

var mysql = require("mysql");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

const port = process.env.PORT

//======== CUSTOM FUNCTIONS ==========
global.handleError = function(err, res) {
    console.log("ERROR:" + err);
    res.status(500, {}).end("Internal Server Error");
}

//======== MIDDLEWARE =========
//Database connection
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res, next) {
    res.locals.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    res.locals.connection.connect(function(err) {
        if (err) {
            global.handleError(err, res)
        }
    });
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


//======== INDEX =========
app.get('/', (req, res) => res.end('Hello World!'))


//========== FEEDBACK =========
app.use('/feedback', require('./routes/feedback.js'));

//========== FEEDBACKER =========
app.use('/feedbacker', require('./routes/feedbacker.js'));

//========== COMPANIES ==========
app.use('/companies', require('./routes/companies.js'));

//========== PRODUCTS ==========
app.use('/product', require('./routes/product.js'));
app.use('/products', require('./routes/products.js'));


//========== DATABASE ==========
app.use('/database', require('./routes/database.js'));

var server = app.listen(port, () => console.log(`Feedback Server > Listening on port ${port}!`))
