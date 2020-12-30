'use strict';
const mongoose = require("mongoose");

//region MongoDB
const uri = "mongodb+srv://dbUser:COMP3006pw@cluster0.8a4if.mongodb.net/QuizPals?retryWrites=true&w=majority";

//connect to the db
//mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

//var dbo2 = mongoose.connection;

//dbo2.on('error', console.error.bind(console, 'connection error:'));
//dbo2.once('open', function () {
//    console.log("connection successful")
//});

exports.uri = uri;

