var config = require("../config/config");
var usersModel = require("../models/users-model") //TODO: user model as embedded document
var mongoose = require('mongoose');
const { ObjectID } = require("mongodb");
const { quizGroup } = require("../controllers/quizgroup-controller");
const quizModel = require("./quiz-model");
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

var quizGroupUser = new mongoose.Schema({
    _id: ObjectID,
    FullName: String,
    UserName: String,
});

var quizGroupSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    GroupName: String,
    Password: String,
    GroupMembers: [quizGroupUser],
    Quizzes: [quiz]
});

const QuizGroupTable = mongoose.model('QuizGroup', quizGroupSchema);

module.exports = {

    QuizGroupTable,

    //"REGION" CRUD operations

    createQuizGroup: function (quizgroup, callback) {

        //QuizGroupTable.init();

        quizgroup = new QuizGroupTable(quizgroup);
        quizgroup.save(function (err, quizgroup) {
            if (err) throw err;

            return callback(quizgroup.toObject());
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
            return callback(data);        
        })

    },

    updateQuizGroup: function (quizGroupID, quizGroup, callback) {
        QuizGroupTable.findByIdAndUpdate(quizGroupID, quizGroup, function(err, updatedQuizGroup) {
            if(err) {
                console.log(err)
            }
            else {
                return callback(updatedQuizGroup.toObject())
            }
        });
       
    },

    deleteQuizGroup: function (quizGroupID, callback) {
        QuizGroupTable.findByIdAndDelete(quizGroupID, function (err, deletedQuizGroup) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Deleted Quiz Group: ", deletedQuizGroup);
                return callback(deletedQuizGroup)
            }
        });
    },

    //"END REGION"

    //"REGION" Bespoke function

    QuizGroupCount: function (query, callback) {
        var quizGroupCount = QuizGroupTable.find(query).countDocuments();
        quizGroupCount.exec(function (err, data) {
            if (err) throw err;
            return callback(data);
        })

    },

    insertUserToQuizGroup: function (quizgroup, callback) {

        quizgroup = new QuizGroupTable(quizgroup);

        //pushes the user to the embbed document
        quizgroup.GroupMembers.push({ quizGroupUserID: "", FullName: "", UserName: "" })

        //saves the quizgroup
        quizgroup.save(function (err, quizgroup) {
            if (err) throw err;
            return callback(quizgroup);
        })

    }


};