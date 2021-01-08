var config = require("../config/config");
var mongoose = require('mongoose');
const { ObjectID } = require("mongodb");
var db = config.db;

// create an schema
var userSchema = new mongoose.Schema({
    _id: ObjectID,
    FullName: String,
    UserName:String,
    Password: String
});


userTable = mongoose.model('User', userSchema);

module.exports = {

    userTable,

    //"REGION" CRUD operations

    createUser: function (user, callback) {

        console.log(user);

        newUser = new userTable(user);
        newUser.save(function (err, user) {
            console.log(user);
            if (err) throw err;
            return callback(user);
        })

    },

    ListAllUsers: function (callback) {
        var quizGroups = QuizGroupTable.find({});
        quizGroups.exec(function (err, data) {
            if (err) throw err;
            return callback(data);
        })

    },

    FindUser: function (query, callback) {
        var user = userTable.find(query);
        user.exec(function (err, data) {
            if (err) throw err;
            return callback(data);
        })

    },

    CheckUserExists: function (query, callback) {        
        var user = userTable.find(query).countDocuments();
        user.exec(function (err, data) {
            if (err) throw err;
            return callback(data);
        })

    },

    readUser: function () {

        data = "Form data was read";
        return data;
    },

    updateUser: function () {

        data = "Form data was updated";
        return data;
    },

    deleteUser: function () {

        data = "Form data was deleted";
        return data;
    }

    //"END REGION"

};