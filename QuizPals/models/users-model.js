var config = require("../config/config");
var mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const { ObjectID } = require("mongodb");
const { user } = require("../app/models/user");
var db = config.db;

// create an schema
const userSchema = new mongoose.Schema({
    FullName: String,
    UserName:String,
    Password: String
});

//userSchema.plugin(passportLocalMongoose, { usernameField: 'UserName' });

userTable = mongoose.model('User', userSchema);
//var User : mongoose.model<any> = mongoose.model('User', userSchema);

module.exports = {

    userSchema,

    userTable,

    createUser: function (user, callback) {
        
        newUser = new userTable(user);
        newUser.save(function (err, user) {
            if (err) throw err;
            console.log("New User Created in User Model")
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

    updateUser: function (user, callback) {

        newUser = new userTable(user);
        newUser.save(function (err, user) {
            if (err) throw err;
            console.log("New User Created in User Model")
            return callback(user);
        })

    },

    deleteUser: function (deleteUser, callback) {
        user = new userTable(deleteUser);

        user.deleteOne(function (err) {
        //        if (err) throw err;
        //        console.log("User Deleted in User Model")
        //        return callback(user);
        })
    }

    //   deleteData: function (deleteId, callback) {

    //    userData = userTable.findByIdAndDelete(deleteId);
    //    userData.exec(function (err, data) {
    //        if (err) throw err;
    //        return callback(data);
    //    })
    //}

    //"END REGION"

};