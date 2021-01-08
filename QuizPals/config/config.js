'use strict';
const mongoose = require("mongoose");

//region MongoDB
const uri = "mongodb+srv://dbUser:COMP3006pw@cluster0.8a4if.mongodb.net/QuizPals?retryWrites=true&w=majority";

// Connect to the Mongo database using Mongoose.
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var db = mongoose.connection;



exports.uri = uri;
exports.db = db;

