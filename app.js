var express = require('express');
var logger = require('morgan');
var passport   = require('passport');
var session    = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var env = require('dotenv').config();
// This will be our application entry. We'll setup our server here.
const http = require('http');
// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/nothing', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Listening on port " + port);
});

// app.get("*", (req, res, next) => {
//     res.locals.user = req.user || null;
//     console.log("User: " + res.locals.user);
//     next();
// });

app.set('views', './views')

app.set('view engine', 'ejs');
app.use(express.static('public'));

//Models
var models = require("./models");

//Routes
var authRoute = require('./routes/auth.js');
app.use('/',authRoute);

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});

module.exports = app;