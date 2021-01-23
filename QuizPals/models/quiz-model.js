var config = require("../config/config");
var quizScoreModel = require("./quizscore-model")
var quizQuestionModel = require("./quizquestion-model")
var quizGroupModel = require("./quizgroup-model")

var quizGroupController = require("../controllers/quizgroup-controller")
var mongoose = require('mongoose');
const quizgroupModel = require("./quizgroup-model");
const quizgroupController = require("../controllers/quizgroup-controller");
const quizController = require("../controllers/quiz-controller");
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

module.exports = {

    //quizSchema,

    //"REGION" CRUD operations

    createQuiz: function (quiz, callback) {

        quizgroupModel.FindQuizGroup({ _id: quizGroupID }, function (returnedQuizGroup) {

            //quizController.

        });

    },

    findQuiz: function (quizGroupID, quizName, callback) {

        quizgroupModel.FindQuizGroup({ _id: quizGroupID }, function (returnedQuizGroup) {
            var localQuiz = quizController.getQuizFromQuizGroup(quizName, returnedQuizGroup)

            return callback(localQuiz)
        });

        //data = "Form data was read";
        //return data;
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