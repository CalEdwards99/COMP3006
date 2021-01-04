const mongoose = require("mongoose");
const server = require('/server');
var config = require("./config/config")

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});


//test('testing the connection to the database', () => {
//    // Connect to the Mongo database using Mongoose.
//    var db = config.db

//    db.on('error', function () {
//        //connection to mongodb failed
//        expect(0).toBe(1);
//    });

//    db.once('open', function () {
//        //conection to mongodb successful
//        expect(1).toBe(1);
//    });
//});


