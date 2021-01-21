var config = require("../config/config");
var mongoose = require('mongoose');
var db = config.db;

// create an schema
var quizQuestionSchema = new mongoose.Schema({
    Question: String,
    A: String,
    B: String,
    C: String,
    D: String,
    CorrectAnswer: String  
});

QuizQuestionTable = mongoose.model('QuizQuestion', quizQuestionSchema);

module.exports = {

    QuizQuestionTable,

    //"REGION" CRUD operations

    createQuizQuestion: function (quiz, callback) {

        quiz = new QuizQuestionTable(quiz);
        quiz.save(function (err, quiz) {
            if (err) throw err;
            return callback(quiz);
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
    }


};