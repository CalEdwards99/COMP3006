'use strict';
var http = require('http');
var fs = require('fs');
var url = require("url");


var mongo = require("mongodb");
//const mongoose = require("mongoose");
var config = require("./config/config")

var express = require("express");
var path = require('path');

//passport for user authentication
const passport = require("passport")
const LocalStrategy = require("./config/passport")(passport)


//allows for session variables to be stored
const session = require("express-session")

//flash messages display messages on screen
const flash = require('connect-flash');

var bodyParser = require('body-parser');
const { group } = require('console');

var app = express();

const hostname = '127.0.0.1';
var port = process.env.PORT || 9000;

// Connect to the Mongo database using Mongoose.
var db = config.db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// Enable processing of post forms.
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//setup public folder
app.use(express.static('./public'));

//this line is required to parse the request body
app.use(express.json())

app.use(passport.initialize());
app.use(passport.session());
//current User
//app.use(function (req, res, next) {
//    res.locals.currentUser = req.user;
//    next();
//})

//MIDDLEWARE
//function isLoggedIn(req, res, next) {
//    if (req.isAuthenticated()) {
//        return next();
//    }
//    res.redirect("pages/login");
//}

//this line defines the routers
var indexRouter = require('./routes/index-route');
app.use('/', indexRouter);

var quizGroupRouter = require('./routes/quizgroup-route');
app.use('/QuizGroup', quizGroupRouter);

var userRouter = require('./routes/users-route');
app.use('/User', userRouter);

var quizRouter = require('./routes/quiz-route');
app.use('/Quiz', quizRouter);

var quizQuestionRouter = require('./routes/quizquestions-route');
app.use('/QuizQuestion', quizQuestionRouter);

app.get('/', function (req, res) {
    res.render('pages/login')
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connection to MongoDB successful");

});

app.listen(port);
console.log('Listening on port ' + port);


//region functions


module.exports = app;



