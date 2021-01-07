var config = require("../config/config");
var mongoose = require('mongoose');
var db = config.db;

// create an schema
var quizGroupSchema = new mongoose.Schema({
    GroupName: String,
    Password: String,
    GroupMembers: Array
});

QuizGroupTable = mongoose.model('QuizGroup', quizGroupSchema);

module.exports = {

    //"REGION" CRUD operations

    createQuizGroup: function (quizgroup, callback) {

        quizgroup = new QuizGroupTable(quizgroup);
        quizgroup.save(function (err, quizgroup) {
            if (err) throw err;
            return callback(quizgroup);
        })

    },

    ListAllQuizGroups: function (callback) {
        var quizGroups = QuizGroupTable.find({});
        quizGroups.exec(function (err, data) {
            if (err) throw err;
            return callback(data);
        })

    },

    FindQuizGroup: function (query ,callback) {
        var quizGroups = QuizGroupTable.find(query);
        quizGroups.exec(function (err, data) {
            if (err) throw err;

            //var quizGroup = {quizGroup: data}

            //console.log(quizGroup)
            console.log(data);
            return callback(data);
            
        })

    },

    readQuizGroup: function () {

        data = "Form data was read";
        return data;
    },

    updateQuizGroup: function () {

        data = "Form data was updated";
        return data;
    },

    deleteQuizGroup: function () {

        data = "Form data was deleted";
        return data;
    },

    //"END REGION"

    //"REGION" Bespoke function
    insertUserToQuizGroup: function () {

    }


};