var config = require("../config/config");
var mongoose = require('mongoose');
var db = config.db;

// create an schema
var quizSchema = new mongoose.Schema({
    QuizTitle: String
});

QuizTable = mongoose.model('Quiz', quizSchema);

module.exports = {

    //"REGION" CRUD operations

    createQuiz: function (quiz, callback) {

        quiz = new QuizTable(quiz);
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