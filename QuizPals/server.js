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
require("./config/passport");
const LocalStrategy = require("./config/passport")(passport)
const passportLocalMongoose = require("passport-local-mongoose")


//allows for session variables to be stored
const session = require("express-session")

//flash messages display messages on screen
const flash = require('connect-flash');

var bodyParser = require('body-parser');
const { group } = require('console');

var app = express();

const hostname = '127.0.0.1';
var port = process.env.PORT || 9000;

//var Schema = mongoose.Schema;

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
    cookie: {
        maxAge: 2 * 60 * 1000
    }
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

//app.use(express.static(path.join(__dirname, "statics")));

//setup public folder
app.use(express.static('./public'));

//this line is required to parse the request body
app.use(express.json())

//passport.serializeUser(User.serializeUser());       //session encoding
//passport.deserializeUser(User.deserializeUser());   //session decoding
//passport.use(new LocalStrategy(User.authenticate()));
//end session

app.use(passport.initialize());
app.use(passport.session());
//current User
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("pages/login");
}

//this line defines the routers
var quizGroupRouter = require('./routes/quizgroup-route');
app.use('/QuizGroup', quizGroupRouter);

var userRouter = require('./routes/users-route');
app.use('/User', userRouter);

app.get('/', function (req, res) {
    res.render('pages/login')
});

app.get('/JoinQuiz', quizRoute);

app.get('/CreateQuiz', createQuizRoute)

app.get("/QuizDashboard" , quizDashboardRoute);

app.post("/JoinQuiz/Login", quizDashboardRoute);

//let server = http.createServer(function (req, res) {
//    var q = url.parse(req.url, true)
//    var filename = "." + q.pathname
//    fs.readFile(filename, function (err, data) {
//        if (err) {
//            res.writeHead(404, { 'Content-Type': 'text/html' });
//            return res.end("404 Not Found");
//        }
//        res.writeHead(200, { 'Content-Type': 'text/html' });
//        res.write(data);
//        return res.end();
//    });

//}).listen(port, hostname);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connection to MongoDB successful");

});

app.listen(port);
console.log('Listening on port ' + port);


//region functions

async function quizRoute(request, response) {
    //let users = await usermodel.listAllUsers();
    await db.collection("QuizGroup").find({}).toArray(function (err, returnedQuizzes) {
        if (err) throw err;

        let GroupName = "";
        let Password = "";
        let quizlogin = { GroupName: GroupName, Password: Password };
        let quizGroups = returnedQuizzes;

        let data = { quiz: quizGroups, login: quizlogin };
        console.log(data);
        response.render("pages/JoinQuiz", data);
    });
}

async function createQuizRoute(request, response) {

    let message = "";
    let quiz = "";

    let data = { message: message, quiz: quiz };

    response.render('pages/CreateQuiz', data);
}

async function quizDashboardRoute(request, response) {
    //console.log("getting here")

    var quiz = request.body;
    var groupname = quiz.GroupName;
    console.log(groupname)
    //var password = quiz.Password;

    var groupDetails = { GroupName: groupname};

    await db.collection("QuizGroup").find(groupDetails).toArray(function (err, returnedQuizGroup) {
        if (err) throw err;

        let quizGroupDetails = returnedQuizGroup;

        let data = { quizGroup : quizGroupDetails };
        console.log(data);

        response.render("pages/QuizDashboard", data);
    });

}

//async function test() {

//    var groupname = "Computing Revision";

//    var query = { GroupName: groupname };

//    //var quizGroups = await db.collection("QuizGroup").find({}).toArray
//    await db.collection("QuizGroup").find(query).toArray(function (err, returnedUsers) {
//        if (err) throw err;

//         console.log(returnedUsers);    

//         return;
//    });

//}


//TODO: list all the quiz groups within this function
//function listQuizGroups() {
//    db.collection("QuizGroup").find({}).toArray(function (err, returnedQuizzes) {
//        if (err) throw err;
//        return returnedQuizzes;
//    });
//}

//async function saveQuizGroup(quizgroup) {
//        await db.collection("QuizGroup").insertOne(quizgroup)
//}



module.exports = app;



