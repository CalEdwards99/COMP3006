var config = require("../config/config");
//var usersModel = require("../models/users-model") //TODO: user model as embedded document
var mongoose = require('mongoose');
const { ObjectID } = require("mongodb");
//const { quizGroup } = require("../controllers/quizgroup-controller");
const quizModel = require("./quiz-model");
var db = config.db;

//----------Schemas-------------//

const quizScore = new mongoose.Schema({
    _id: ObjectID,
    UserName: String,
    Score: String
});

const quizQuestion = new mongoose.Schema({
    //QuestionNumber: { type:String, default: "1" },
    Question: { type: String, default: "Question 1" },
    A: { type: String, default: "Answer 1" },
    B: { type: String, default: "Answer 2" },
    C: { type: String, default: "Answer 3" },
    D: { type: String, default: "Answer 4" },
    CorrectAnswer: { type: String, default: "A" }
});

const quiz = new mongoose.Schema({
    //_id: ObjectID,
    QuizTitle: { type: String, required: false },
    QuizCreator: { type: String, required:false },
    //Questions: {type: quizQuestion, required: false },
    Questions: [quizQuestion],
    UserScores: [quizScore]
});

const quizGroupUser = new mongoose.Schema({
    _id: ObjectID,
    FullName: String,
    UserName: String,
});

const quizGroupSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    GroupName: String,
    Password: String,
    //GroupMembers: { type: quizGroupUser, default: () => ({}) },
    GroupMembers: [quizGroupUser],
    //Quizzes: [{ type: quiz, required: false }]
    Quizzes: [{ type: quiz, required: false }]
});

//-------Model----------//

const QuizGroupTable = mongoose.model('QuizGroup', quizGroupSchema);

module.exports = {
    //export the schema's

    quizScore,

    quizQuestion,

    quiz,

    quizGroupUser,

    quizGroupSchema,

    QuizGroupTable,

    //"REGION" CRUD operations

    createQuizGroup: function (quizgroup, callback) {

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
        QuizGroupTable.find(query, function (err, quizGroup) {
            if (err) {
                console.log(err)
            }
            else {
                return callback(quizGroup);
            }
                    
        })

    },

    updateQuizGroup: function (quizGroupID, quizGroup, callback) {



        console.log("Finding By ID and updating")
        console.log(quizGroupID)
        console.log(quizGroup)

        QuizGroupTable.findByIdAndUpdate(quizGroupID, quizGroup, function (err, updatedQuizGroup) {
           
            if(err) {
                console.log(err)
            }
            else {
                console.log("Updated Quiz Group")
                //console.log(updatedQuizGroup.toObject)
                //console.log(updatedQuizGroup.toObject())
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

    //insertUserToQuizGroup: function (user,quizgroup, callback) {

    //    quizgroup = new QuizGroupTable(quizgroup);

        

    //    //pushes the user to the embbed document
    //    quizgroup.GroupMembers.push({ quizGroupUserID: user , FullName: "", UserName: "" })

    //    //saves the quizgroup
    //    quizgroup.save(function (err, quizgroup) {
    //        if (err) throw err;
    //        return callback(quizgroup);
    //    })

    //},


};