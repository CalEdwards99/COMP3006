var quizGroupModel = require('../models/quizgroup-model');
//var userController = require('../controllers/users-controller');
var mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const { convertReturnedUserToLocal } = require('./users-controller');
const quizgroupModel = require('../models/quizgroup-model');

//public controller properties
const quizScore = {
    UserName: String,
    Score: Number
};

var quizQuestion = {
    QuestionNumber: String,
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
        //console.log("quiz group ID: " + returnedQuizGroupQuiz[i]._id)
        if (returnedQuizGroupQuiz[i]._id != null) { quiz.__id = returnedQuizGroupQuiz[i]._id }
        if (returnedQuizGroupQuiz[i].QuizCreator != null) { quiz.QuizCreator = returnedQuizGroupQuiz[i].QuizCreator }
        if (returnedQuizGroupQuiz[i].QuizTitle != null) { quiz.QuizTitle = returnedQuizGroupQuiz[i].QuizTitle }
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

    //console.log(usersInQuizGroup)
    //console.log("index of" + usersInQuizGroup.indexOf(localUser._id))

    //if (usersInQuizGroup.includes(localUser._id)) {
    var isUserInQuizGroup = usersInQuizGroup.indexOf(localUser._id)
    console.log(isUserInQuizGroup)
    if (isUserInQuizGroup == -1) {
        console.log("Adding user to Quiz Group")
        localQuiz.GroupMembers.push(localUser)
    } else {
        console.log("user already in quiz group")
    }

    return localQuiz

}

// TODO: what should this name be?
function upsertQuizToQuizGroup(quiz, returnedQuizGroup) {
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

    //console.log(usersInQuizGroup)
    //console.log("index of" + usersInQuizGroup.indexOf(localUser._id))

    //if (usersInQuizGroup.includes(localUser._id)) {
    var isUserInQuizGroup = usersInQuizGroup.indexOf(localUser._id)
    console.log(isUserInQuizGroup)
    if (isUserInQuizGroup == -1) {
        console.log("Adding user to Quiz Group")
        localQuiz.GroupMembers.push(localUser)
    } else {
        console.log("user already in quiz group")
    }

    return localQuiz

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

        var quizGroup = req.body;

        quizGroupModel.createQuizGroup(quizGroup, function (returningData) {

            var message = "Quiz Group: " + returningData.GroupName + " saved to database";
            let pageData = { quiz: returningData, message: message };

            res.render("pages/CreateQuizGroup", pageData)
            console.log("New QuizGroup Added");
        });
    },

    listAllQuizGroup: function (req, res) {

        //var localUser = userController.returnedQuizGroupUser()
        console.log(req.body)

        quizGroupModel.ListAllQuizGroups(function (returningData) {

            let GroupName = "";
            let Password = "";
            let quizlogin = { GroupName: GroupName, Password: Password };

            let data = { quiz: returningData, login: quizlogin };

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

            //localQuiz.Quizzes.push()

            console.log(localQuiz.Quizzes)

            console.log("local quiz after push")
            console.log(localQuiz)

            quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (QuizGroup) {
                //quizgroupModel.addQuizToQuizGroup(localQuiz, function (QuizGroup) {

                    quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                        var updatedQuizGroup = convertQuizGroupToLocal(returnedQuizGroup)

                        //console.log()

                        console.log("navigating to quiz create page")
                        res.render('pages/createquiz', { quizGroupID: quizGroupID });

                    })

                

                

            });


        })
    },

    //Bespoke functions 
    insertUserToQuizGroup: function (req, res) {
        var quizGroup = req.body;

        var query = { _id: quizGroup }

        quizGroupModel.insertUserToQuizGroup(quizGroup, function (returnedQuizGroupUser) {

            console.log(returnedQuizGroupUser)

        });
    },

    loginQuizGroup: function (req, res) {

        //var localUser = userController.findUser

        var quizGroup = req.body;

        console.log(quizGroup);

        var query = { _id: quizGroup }

        quizGroupModel.FindQuizGroup(query, function (returningData) {

            let data = { quiz: returningData, login: returningData };

            console.log(data)

            res.render("pages/JoinQuiz", data);
            console.log("Login box being populated");
        })

    },

    dashboardQuizGroup: function (req, res) {
        var user = req.user;

        console.log(user)
        var quizGroupID = req.body;

        console.log(quizGroupID);

        var query = { _id: quizGroupID }

        quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
            var QuizGroup = upsertLoggedInUserToQuizGroup(user, returnedQuizGroup)

            quizGroupModel.updateQuizGroup(quizGroupID, QuizGroup, function (dontBother) {
                quizGroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                    let data = { quizGroup: returnedQuizGroup };

                    console.log(data)

                    res.render("pages/QuizDashboard", data);
                    console.log("Login Successful");
                })
            })


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

    upsertLoggedInUserToQuizGroup



}