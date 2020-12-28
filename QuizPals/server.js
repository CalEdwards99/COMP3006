'use strict';
var http = require('http');
var fs = require('fs');
var url = require("url");

//let path = require("path");
var mongo = require("mongodb");
const mongoose = require("mongoose");
var express = require("express");
let db = require("./Database/db");
//var nodemailer = require('nodemailer'); //might be needed, sends emails, not in use for now
//var datetime = require('./Business/datetime');



//region MongoDB

const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://dbUser:COMP3006pw@cluster0.8a4if.mongodb.net/<database name>?retryWrites=true&w=majority";
const uri = "mongodb+srv://dbUser:COMP3006pw@cluster0.8a4if.mongodb.net/QuizPals?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    // perform actions on the collection object
    if (err) throw err;

    //connects to the database
    var dbo = client.db("QuizPals");

    //Inserts a record to the db
    //var myobj = { name: "Callum Edwards", User: "CalEdwards" };
    //dbo.collection("User").insertOne(myobj, function (err, res) {
    //    if (err) throw err;
    //    console.log("1 document inserted");
    //    client.close();
    //});

    //Lists all the users in the user table
    //dbo.collection("User").find({}).toArray(function (err, result) {
    //    if (err) throw err;
    //    console.log(result);
    //    client.close();
    //});
    //client.close();
});
//end region


//region database

//connecting to the database
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

var dbo2 = mongoose.connection;

dbo2.on('error', console.error.bind(console, 'connection error:'));
dbo2.once('open', function () {
    console.log("connection successful")
    //mongoose.connection.db.listCollections().toArray(function (err, names) {
    //    console.log(names); // [{ name: 'dbname.myCollection' }]
    //});
});

var User = mongoose.model('user')

var Schema = mongoose.Schema;
//var userSchema = new Schema({
//    name: String,
//    User: String
//});

//const userSchema = mongoose.model('User', Schema({
//    name: String,
//    User: String
//}));

//Create model===================================================
//var UserModel = dbo2.model('User', userSchema);

Console.log(User.find())

//userSchema.find();

//const user = mongoose.model('User', userSchema);

//user.find(function (err, users) {
//    if (err) return console.error(err);
//    console.log(users);
//})



//dbo2.collection("User").find({}).toArray(function (err, result) {
//    if (err) throw err;
//    console.log(result);
//});

async function listAllUsers(request, response) {
    let users = await db.listAllUsers();
    let data = { users: users };
    response.render("users", data);
}

//let app = express();

//Setup the app to use EJS templates.
//app.set("web", path.join(__dirname, "web"));
//app.set("view engine", "ejs");

//app.get("/Web/JoinQuiz", listAllUsers);

//app.listen()

//end region


//region server
const hostname = '127.0.0.1';
var port = process.env.PORT || 9000;

http.createServer(function (req, res) {
    var q = url.parse(req.url, true)
    var filename = "." + q.pathname
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }  
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });

    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //res.write("The date and time currently is: " + datetime.myDateTime());
    //res.write('Hello World\n')
    //res.end();
}).listen(port, hostname);

//end region




