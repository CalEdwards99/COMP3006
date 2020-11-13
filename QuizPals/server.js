'use strict';
var http = require('http');
var fs = require('fs');
var url = require("url");
var mongo = require("mongodb");
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
    var myobj = { name: "Callum Edwards", User: "CalEdwards" };
    dbo.collection("User").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        client.close();
    });

    //Lists all the users in the user table
    dbo.collection("User").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        client.close();
    });
    //client.close();
});
//end region


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




