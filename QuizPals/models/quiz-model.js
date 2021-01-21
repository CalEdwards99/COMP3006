var config = require("../config/config");
var quizScoreModel = require("./quizscore-model")
var quizQuestionModel = require("./quizquestion-model")
var mongoose = require('mongoose');
var db = config.db;

var quizScore = new mongoose.Schema({
    _id: String,
    UserName: String,
    Score: String
});

var quizQuestion = new mongoose.Schema({
    Question: String,
    A: String,
    B: String,
    C: String,
    D: String,
    CorrectAnswer: String
});

var quiz = new mongoose.Schema({
    QuizTitle: String,
    QuizCreator: String,
    Questions: [quizQuestion],
    UserScores: [quizScore]
});

//var quizSchema = new mongoose.Schema({
//    QuizTitle: String,
//    QuizCreator: String,
//    Questions: [quizQuestionModel.quizQuestionSchema],
//    UserScores: [quizScoreModel.quizScoreSchema]
//});

//QuizTable = mongoose.model('Quiz', quizSchema);

module.exports = {

    //quizSchema,

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