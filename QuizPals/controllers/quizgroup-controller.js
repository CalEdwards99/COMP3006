var quizGroupModel = require('../models/quizgroup-model');
//var userController = require('../controllers/users-controller');
var mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const { convertReturnedUserToLocal } = require('./users-controller');
const quizgroupModel = require('../models/quizgroup-model');
var passwordHelper = require("../helper/password");

//public controller properties
const quizScore = {
    _id: ObjectID,
    UserName: String,
    Score: Number
};

var quizQuestion = {
    //QuestionNumber: String,
    Question: String,
    A: String,
    B: String,
    C: String,
    D: String,
    CorrectAnswer: String
};

var quiz = {
    //_id: ObjectId,
    QuizTitle: String,
    QuizCreator: String,
    Questions: [quizQuestion],
    UserScores: [quizScore]
};


const quizGroupUser = {
    _id: ObjectID,
    FullName: String,
    UserName: String,
};

const quizGroup = {
    //_id: ObjectID,
    GroupName: String,
    Password: String,
    GroupMembers: [quizGroupUser],
    Quizzes: [quiz]
};

// private functions (to be exported)
function convertQuizGroupToLocal(returnedQuizGroup) {

    for (let i in returnedQuizGroup) {
        if (returnedQuizGroup[i]._id != null) { quizGroup._id = returnedQuizGroup[i]._id }
        if (returnedQuizGroup[i].GroupName != null) { quizGroup.GroupName = returnedQuizGroup[i].GroupName }
        if (returnedQuizGroup[i].Password != null) { quizGroup.Password = returnedQuizGroup[i].Password }
        if (returnedQuizGroup[i].GroupMembers != null) { quizGroup.GroupMembers = returnedQuizGroup[i].GroupMembers }
        if (returnedQuizGroup[i].Quizzes != null) { quizGroup.Quizzes = returnedQuizGroup[i].Quizzes }
    }
    return quizGroup

}

function convertQuizGroupUserToLocal(returnedQuizGroupUser) {

    for (let i in returnedQuizGroupUser) {
        if (returnedQuizGroupUser[i]._id != null) { quizGroupUser._id = returnedQuizGroupUser[i]._id }
        if (returnedQuizGroupUser[i].FullName != null) { quizGroupUser.FullName = returnedQuizGroupUser[i].FullName }
        if (returnedQuizGroupUser[i].UserName != null) { quizGroupUser.UserName = returnedQuizGroupUser[i].UserName }
    }
    return quizGroupUser

}
function convertQuizGroupQuizToLocal(returnedQuizGroupQuiz) {

    for (let i in returnedQuizGroupQuiz) {
        //if (returnedQuizGroupQuiz[i]._id != null) { quiz._id = returnedQuizGroupQuiz[i]._id }
        if (returnedQuizGroupQuiz[i].QuizTitle != null) { quiz.QuizTitle = returnedQuizGroupQuiz[i].QuizTitle }
        if (returnedQuizGroupQuiz[i].QuizCreator != null) { quiz.QuizCreator = returnedQuizGroupQuiz[i].QuizCreator }
        if (returnedQuizGroupQuiz[i].Questions != null) { quiz.Questions = returnedQuizGroupQuiz[i].Questions }
        if (returnedQuizGroupQuiz[i].UserScores != null) { quiz.UserScores = returnedQuizGroupQuiz[i].UserScores }
    }
    return quiz
}

// TODO: what should this name be?
function upsertLoggedInUserToQuizGroup(user, returnedQuizGroup) {
    var localQuiz = convertQuizGroupToLocal(returnedQuizGroup)
    var localUser = convertReturnedUserToLocal(user)

    console.log(localUser)
    console.log(localUser._id)

    var usersInQuizGroup = []

    console.log()

    for (let i in localQuiz.GroupMembers) {
        var groupMember = convertReturnedUserToLocal(localQuiz.GroupMembers)
        usersInQuizGroup.push(groupMember._id)
    }

    //if (usersInQuizGroup.includes(localUser._id)) {
    var isUserInQuizGroup = usersInQuizGroup.indexOf(localUser._id)
    console.log(isUserInQuizGroup)
    if (isUserInQuizGroup == -1) {
        console.log("Adding user to Quiz Group")
        localQuiz.GroupMembers.push(localUser)
        //quizGroupModel.updateQuizGroup()
    } else {
        console.log("user already in quiz group")
    }

    return localQuiz

}

// TODO: what should this name be?
function calculateUserScores(returnedQuizGroup) {
    var localQuiz = convertQuizGroupToLocal(returnedQuizGroup)
    //var localUser = convertReturnedUserToLocal(user)

    //list all users in quiz group
    var usersInQuizGroup = []
    var userIDsInQuizGroup = []
    var userScores = []
    var userIDsAndTotalScore = []
    var userNamesAndTotalScore = []

    //loops over all of the group members
    for (let i in localQuiz.GroupMembers) {
        var groupMember = convertReturnedUserToLocal(localQuiz.GroupMembers)
        usersInQuizGroup.push(groupMember.UserNames)
        userIDsInQuizGroup.push(groupMember._id)
        var groupMemberID = groupMember._id.toString()

        var groupMemberScore = []

        var quizgroupdquizIndex = 0 
        let sum = 0;
        
        //loop over all quizzes, to see all of the scores
        for (let q in localQuiz.Quizzes) {

            var currentQuiz = localQuiz.Quizzes[quizgroupdquizIndex]

            var userScores = currentQuiz.UserScores

            currentUserScoreIndex = 0
            for (let us in userScores) {
                var currentUserScore = userScores[currentUserScoreIndex]

                console.log("currentUseScore")
                console.log(currentUserScore)

                currentUserScoreID = currentUserScore._id.toString()

                if (currentUserScoreID === groupMemberID) {
                    groupMemberScore.push(currentUserScore.Score)
                }

            }
            quizgroupdquizIndex++
        }

        for (let i = 0; i < groupMemberScore.length; i++) {
            sum += parseInt(groupMemberScore[i])
        }

        userNamesAndTotalScore.push({Username : groupMember.UserName, HighScore : sum.toString() })

    }


    return userNamesAndTotalScore

}

module.exports = {

    //TODO:CE Populate quiz group page
    quizGroupForm: function (req, res) {

        var noData = { GroupName: "", Password: "" } //no groupname or password when loading
        var message = ""; //no message when loading page
        let pageData = { quiz: noData, message: message };

        res.render('pages/CreateQuizGroup', pageData);
    },

    createQuizGroup: function (req, res) {
        let errors = [];

        //var quizGroup = req.body;

        var groupname = req.body.GroupName;
        var password = req.body.Password;
        var confirmPassword = req.body.ConfirmPassword;

        console.log("req body")
        console.log(req.body)

        if (!groupname || !password || !confirmPassword) {
            errors.push({ msg: "Please fill all fields" })
        }

        const quizGroup = {
            GroupName: groupname,
            Password: password
        }

        if (password !== confirmPassword) {
            errors.push({ msg: "Please ensure passwords match" });
        }

        if (errors.length > 0) {
            let pageData = { quiz: quizGroup, errors: errors };
            console.log("page data")
            console.log(pageData)
            res.render('pages/CreateQuizGroup', pageData)
        } else { // no errors so create a new quiz group

            passwordHelper.generatePassword(quizGroup.Password, function (returnedPassword) {
                quizGroup.Password = returnedPassword //encrypts the password

                quizGroupModel.createQuizGroup(quizGroup, function (returningData) {

                    //var message = "Quiz Group: " + returningData.GroupName + " saved to database";
                    errors.push({ msg: "Quiz Group: " + returningData.GroupName + " saved to database" });
                    let pageData = { quiz: returningData, errors: errors };

                    res.render("pages/CreateQuizGroup", pageData)
                    console.log("New QuizGroup Added");
                });
            })
        }
    },

    listAllQuizGroup: function (req, res) {

        console.log(req.body)

        quizGroupModel.ListAllQuizGroups(function (returningData) {

            //let GroupName = "";
            //let Password = "";
            //let quizlogin = { GroupName: GroupName, Password: Password };

            let data = { quiz: returningData, login: null };

            res.render("pages/joinquiz", data);
            //console.log("Listing all Quiz Groups");
        })

    },
    editQuizGroup: function (req, res) {
        const editId = req.params.id;
        const editData = quizGroupModel.updateQuizGroup(editId);
        res.render('/pages/quizgroup', { editData: editData, editId: editId });
    },
    deleteQuizGroup: function (req, res) {
        const deleteId = req.params.id;
        const deleteData = quizGroupModel.deleteQuizGroup(deleteId);
        res.send('<h1>' + deleteData + '</h1>');
    },

    //---------Quiz Group Quizzes -------------//

    AddQuizForm: function (req, res) {

        var quizGroupID = req.body

        console.log(quizGroupID)

        console.log("navigating to quiz create page")
        res.render('pages/createquiz', quizGroupID);
    },

    AddQuiz: function (req, res) {
        var localUser = convertQuizGroupUserToLocal(req.user)
        console.log("local User")
        console.log(localUser)

        console.log("Req.body")
        console.log(req.body)

        var quizGroupID = req.body.QuizGroupID

        var query = { _id: quizGroupID }

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

            var localQuiz = convertQuizGroupToLocal(returnedQuizGroup)

            console.log(localQuiz)
            console.log(localQuiz._id)

            var quiz = {
                QuizTitle: req.body.QuizTitle,
                QuizCreator: localUser.UserName,
                //Questions: [quizQuestion],
                //UserScores: [quizScore]
            };



            localQuiz.Quizzes.push(quiz)

            console.log(localQuiz.Quizzes)

            console.log("local quiz after push")
            console.log(localQuiz)

            quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (QuizGroup) {

                var newQuiz = localQuiz.Quizzes.pop();
                console.log(newQuiz)
                var pageData = { quiz: newQuiz, quizGroup: quizGroupID, questionNumber: "1" }

                console.log("page data")
                console.log(pageData)

                console.log("navigating to add question to quiz section")
                res.render('pages/quizquestion', pageData);

            });


        })
    },

    //---------Quiz Group - Quiz - Questions -------------//


    AddQuestion: function (req, res) {
        var quizGroupID = req.body.quizGroupID
        var QuizID = req.body.quizID
        var questionNumber = req.body.questionNumber


        console.log(req.body)

        var Question = {
            Question: req.body.QuestionTitle,
            A: req.body.Answer1,
            B: req.body.Answer2,
            C: req.body.Answer3,
            D: req.body.Answer4,
            CorrectAnswer: req.body.CorrectAnswer
        }

        var query = { _id: quizGroupID }

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

            var quizGroup = convertQuizGroupToLocal(returnedQuizGroup)

            var subdoc = quizGroup.Quizzes.id(QuizID); //where id is the sub-doc _id
            console.log(subdoc)

            subdoc.Questions.push(Question)

            quizGroup.Quizzes.push(subdoc)
            quizGroup.Quizzes.splice(-1, 1)

            //quizGroup.Quizzes.

            quizgroupModel.updateQuizGroup(quizGroupID, quizGroup, function (QuizGroup) {

                questionNumber++ //keep track of how many questions have been added to the Quiz

                var pageData = { quiz: subdoc, quizGroup: quizGroupID, questionNumber: questionNumber }
                console.log("navigating to add question to quiz section")
                res.render('pages/quizquestion', pageData);

            });

        })

    },

    //Starts taking the Quiz, displays the first question in the Quiz
    TakeQuizForm: function (req, res) {
        console.log(req.body)
        var quizGroupID = req.body._id
        var quizID = req.body._quizID
        var currentScore = "0"
        var query = { _id: quizGroupID }

        //find the correct Quiz Group
        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
            var quizGroup = convertQuizGroupToLocal(returnedQuizGroup)

            //find the correct Quiz Group - Quiz
            var quiz = quizGroup.Quizzes.id(quizID);
            console.log(quiz)
            var firstQuestion = quiz.Questions[0]

            var pagedata = { quizGroupID: quizGroupID, quizID: quizID, quiz: quiz, question: firstQuestion, questionNumber: "1", currentScore: currentScore }
            //var pagedata = { quizID: quizID, quiz: quiz, question : null}
            console.log(pagedata)

            res.render("pages/takequiz", pagedata)
        })
    },

    //Displays the next Question in the Quiz, updates the user score
    NextQuestion: function (req, res) {
        console.log(req.body)
        var quizGroupID = req.body._id
        var quizID = req.body._quizID
        var questionNumber = req.body.questionNumber
        var userAnswer = req.body.UserAnswer
        var correctAnswer = req.body.CorrectAnswer
        var currentScore = req.body.currentScore
        var query = { _id: quizGroupID }

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
            var quizGroup = convertQuizGroupToLocal(returnedQuizGroup)

            //find the correct Quiz Group - Quiz
            var quiz = quizGroup.Quizzes.id(quizID);
            console.log(quiz)

            //if the user got the question correct then
            console.log("User Answer :" + userAnswer + " Correct Answer: " + correctAnswer)
            if (correctAnswer == userAnswer) {
                console.log("user answered question correctly")
                currentScore++
            }

            //question Number will be one behind as Arrays start at 0
            var currentQuestion = quiz.Questions[questionNumber]

            //Display the next question Number
            questionNumber++
            console.log("Question Number " + questionNumber)

            var pagedata = { quizGroupID: quizGroupID, quizID: quizID, quiz: quiz, question: currentQuestion, questionNumber: questionNumber, currentScore: currentScore }
            console.log(pagedata)

            res.render("pages/takequiz", pagedata)
        })
    },

    //finish the quiz, saves the user score for this quiz. TODO: if user already has a record, don't save
    FinishQuiz: function (req, res) {
        console.log(req.body)
        console.log(req.user)
        var quizGroupID = req.body._id
        var quizID = req.body._quizID
        var localUser = convertQuizGroupUserToLocal(req.user)
        var finalScore = req.body.finalScore
        var query = { _id: quizGroupID }

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
            var quizGroup = convertQuizGroupToLocal(returnedQuizGroup)

            console.log("quizGroup")
            console.log(quizGroup)

            var quiz = quizGroup.Quizzes.id(quizID);

            console.log("quiz")
            console.log(quiz)

            var newUserScore = {
                _id: localUser._id,
                UserName: localUser.UserName,
                Score: finalScore
            }

            console.log("newUserScore")
            console.log(newUserScore)

            console.log("quiz user score to upload")
            console.log(quiz)

            //adds the user score to the Quiz
            quiz.UserScores.push(newUserScore)

            quizGroup.Quizzes.push(quiz); //updates the local QuizGroup - Quiz to contain the new user score but duplicates the Quiz itself
            quizGroup.Quizzes.splice(-1, 1) //HACK: so the duplicate value is removed here 


            quizGroupModel.updateQuizGroup(quizGroupID, quizGroup, function (unNeeded) {
                quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

                    var userScores = calculateUserScores(returnedQuizGroup)
                    let data = { quizGroup: returnedQuizGroup, quizzes: quizGroup.Quizzes, groupMembers: quizGroup.GroupMembers, userScores : userScores };
                    res.render("pages/quizDashboard", data)
                })
            })


        })
    },


    //---------Quiz Group - Quiz - UserScores -------------//

    //Bespoke functions 

    loginQuizGroupForm: function (req, res) {

        var quizGroup = req.body;

        console.log(quizGroup);

        var query = { _id: quizGroup }

        quizGroupModel.FindQuizGroup(query, function (returningData) {

            let data = { quiz: null, login: returningData };

            console.log(data)

            res.render("pages/JoinQuiz", data);
            console.log("Navigated to Join Quiz Page");
        })

    },

    loginQuizGroup: function (req, res) {
        console.log("req.body")
        console.log(req.body)
        var user = req.user;
        var quizGroupID = req.body._quizGroupID;

        console.log("quizGroupID")
        console.log(quizGroupID);

        var query = { _id: quizGroupID }

        let errors = [];

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

            ////determine if user is navigating to dashboard from Login Page
            var password = req.body.password //password won't be in request body if not navigating from quiz group login page    
            if (password != undefined) { //if password is not undefined AKA navigating from login page
                var inputPassword = req.body.inputPassword
                console.log("plain text password")
                console.log(inputPassword)
                passwordHelper.comparePasswords(inputPassword, password, function (result) {

                    console.log("result: " + result)
                    if (result == false) {
                        errors.push({ msg: "Incorrect Password" })
                        res.render('pages/JoinQuiz', {
                            errors: errors,
                            login: returnedQuizGroup,
                            quiz: null
                        });
                        return null //if navigated to the join quiz page then login has been unsuccessful
                    }
                })
            }

            var QuizGroup = upsertLoggedInUserToQuizGroup(user, returnedQuizGroup)
            quizGroupModel.updateQuizGroup(quizGroupID, QuizGroup, function (dontBother) {
                quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

                    var localQuiz = convertQuizGroupToLocal(returnedQuizGroup)
                    var Quizzes = localQuiz.Quizzes
                    var GroupMembers = localQuiz.GroupMembers

                    var userScores = calculateUserScores(returnedQuizGroup)
                    let data = { quizGroup: returnedQuizGroup, quizzes: Quizzes, groupMembers: GroupMembers, userScores: userScores };

                    console.log(data)

                    res.render("pages/QuizDashboard", data);
                    console.log("Navigated to Dashboard");
                })
            })

        })

    },

    dashboardQuizGroup: function (req, res) {
        console.log("req.body")
        console.log(req.body)
        var quizGroupID = req.body._quizGroupID;

        console.log("quizGroupID")
        console.log(quizGroupID);

        var query = { _id: quizGroupID }

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
            var localQuiz = convertQuizGroupToLocal(returnedQuizGroup)
            var Quizzes = localQuiz.Quizzes
            var GroupMembers = localQuiz.GroupMembers

            var userScores = calculateUserScores(returnedQuizGroup)
            let data = { quizGroup: returnedQuizGroup, quizzes: Quizzes, groupMembers: GroupMembers, userScores:userScores };

            console.log(data)

            res.render("pages/QuizDashboard", data);
            console.log("Navigated to Dashboard");

        })

    },

    //exporting properties and access methods

    convertQuizGroupToLocal,

    quizGroup,

    convertQuizGroupUserToLocal,

    quizGroupUser,

    convertQuizGroupQuizToLocal,

    quiz,

    convertQuizUserScoreToLocal: function (returnedQuizUserScore) {

        for (let i in returnedQuizGroupQuiz) {
            if (returnedQuizUserScore[i]._id != null) { quizScore.__id = returnedQuizUserScore[i]._id }
            if (returnedQuizUserScore[i].UserName != null) { quizScore.UserName = returnedQuizUserScore[i].UserName }
            if (returnedQuizUserScore[i].UserName != null) { quizScore.Score = returnedQuizUserScore[i].UserName }
        }

        return quizScore

    },

    quizScore,

    upsertLoggedInUserToQuizGroup,

    calculateUserScores,



}