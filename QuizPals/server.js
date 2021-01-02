'use strict';
var http = require('http');
var fs = require('fs');
var url = require("url");


var mongo = require("mongodb");
const mongoose = require("mongoose");
var config = require("./config/config")

var express = require("express");
var path = require('path');

var bodyParser = require('body-parser');

var app = express();

const hostname = '127.0.0.1';
var port = process.env.PORT || 9000;

var Schema = mongoose.Schema;

//starting again

// Connect to the Mongo database using Mongoose.
mongoose.connect(config.uri, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// Enable processing of post forms.
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, "statics")));

//setup public folder
app.use(express.static('./public'));

//this line is required to parse the request body
app.use(express.json())

app.get('/', function (req, res) {
    res.render('pages/Dashboard')
});

app.get('/JoinQuiz', quizRoute);

app.get('/CreateQuiz', createQuizRoute)

app.get('/QuizDashboard', quizDashboardRoute)

/* Create - POST method */
app.post('/CreateQuiz/add', (req, res) => {
    //get the existing user data
    const existQuizGroups = listQuizGroups(); //TODO:CE implement

    //get the new user data from post request
    const quizGroup = req.body

    //console.log(req.body)

    //check if the userData fields are missing
    if (quizGroup.GroupName == null || quizGroup.Password == null) {
        return res.status(401).send({ error: true, msg: 'Quiz data missing' })
    }

    //check if the username exist already
    //const findExist = existUsers.find(user => user.username === userData.username) //TODO:CE implement
    //if (findExist) {
    //    return res.status(409).send({ error: true, msg: 'Quiz Group already exist' })
    //}

    //append the user data
    //existUsers.push(userData)  //TODO:CE implement

    //save the new user data
    //saveUserData(existUsers);  //TODO:CE implement

    //saves the current quiz to MongoDB
    saveQuizGroup(quizGroup) 

    var message ="Quiz Group: " + quizGroup.GroupName + " saved to database";
    let data = { quiz: quizGroup, message: message };
    //console.log(data);

    return res.render("pages/CreateQuiz", data);
});

app.post("/JoinQuiz/Login", (req, res) => {
    var quiz = req.body;

    console.log(req.body);

    console.log(quiz);

    var groupname = quiz.GroupName
    var password =  quiz.Password

    //db.collection("QuizGroup").find({}).toArray(function (err, returnedQuizzes) {
    db.collection("QuizGroup").find({ Groupname: quiz.GroupName, Password: quiz.password}).toArray(function (err, returnedQuizzes) {
        if (err) throw err;
        console.log(returnedQuizzes);

        return res.render("pages/QuizDashboard")
        return returnedQuizzes;
    });
    });
    

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

//end starting again

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

        //let listedQuizGroups = listQuizGroups();
        //console.log(listedQuizGroups);

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
    await db.collection("Users").find({}).toArray(function (err, returnedUsers) {
        if (err) throw err;

        let members = returnedUsers;
        console.log(returnedUsers);



        //let listedQuizGroups = listQuizGroups();
        //console.log(listedQuizGroups);

        let data = { quizGroup: members };
        console.log(data);
        response.render("pages/QuizDashboard", data);
    });
}


//TODO: list all the quiz groups within this function
function listQuizGroups() {
    db.collection("QuizGroup").find({}).toArray(function (err, returnedQuizzes) {
        if (err) throw err;
        return returnedQuizzes;
    });
}

async function saveQuizGroup(quizgroup) {
        await db.collection("QuizGroup").insertOne(quizgroup)
}

module.exports = app;



