'use strict';
var http = require('http');
var fs = require('fs');
var url = require("url");


var mongo = require("mongodb");
const mongoose = require("mongoose");
var config = require("./config/config")

var express = require("express");
var path = require('path');

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

//app.use(express.static(path.join(__dirname, "statics")));

//setup public folder
app.use(express.static('./public'));

//this line is required to parse the request body
app.use(express.json())

app.get('/', function (req, res) {
    res.render('pages/Dashboard')
});

app.get('/JoinQuiz', quizRoute);

app.get('/CreateQuiz', function (req,res) {
    res.render('pages/CreateQuiz')
});

/* Create - POST method */
app.post('/CreateQuiz/add', (req, res) => {
    //get the existing user data
    //const existUsers = getUserData() //TODO:CE implement

    //get the new user data from post request
    const quizGroup = req.body

    console.log(req.body)

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
    saveQuizGroup(quizGroup)


    res.send({ success: true, msg: 'User data added successfully' })
});

//app.post('/CreateQuiz/add', function (req, res) {
//    //var quiz = {
//    //    GroupName: req.body.GroupName,
//    //    Password: req.body.Password
//    //}
//    console.log(student);
//    res.render('home', {
//        userValue: student,
//        topicHead: 'Student Form'
//    });

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
    console.log("connection to MongoDB successful")

    //let userModel = mongoose.model("user", userSchema);

    //console.log(userModel.find());

});

app.listen(port);
console.log('Listening on port ' + port);

//region functions

async function quizRoute(request, response) {
    //let users = await usermodel.listAllUsers();
    await db.collection("QuizGroup").find({}).toArray(function (err, returnedQuizzes) {
        if (err) throw err;
        //console.log("connected to collection now listing")
        let quizGroups = returnedQuizzes;
        let data = { quiz: quizGroups };
        response.render("pages/JoinQuiz", data);
    });
}

async function saveQuizGroup(quizgroup) {
    await db.collection("QuizGroup").insertOne(quizgroup)
}

// end region "functions"

module.exports = app;



