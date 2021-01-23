var config = require("../config/config");
var mongoose = require('mongoose');

// create an schema
const userSchema = new mongoose.Schema({
    FullName: String,
    UserName:String,
    Password: String
});

const userTable = mongoose.model('User', userSchema);

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

    updateUser: function (userID ,user, callback) {

        userTable.findByIdAndUpdate(userID, user, function (err, updatedUser) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", updatedUser);            
                return callback(updatedUser)
            }
        });
    },

    deleteUser: function (userID, callback) {

        userTable.findByIdAndDelete(userID, function (err, deletedUser) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Deleted User: ", deletedUser);
                return callback(deletedUser)
            }
        });
    }

    //"END REGION"

};