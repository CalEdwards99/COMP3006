var quizGroupModel = require('../models/quizgroup-model');
var userController = require('../controllers/users-controller');
const { ObjectID } = require('mongodb');

//public controller properties
const quizScore = {
    UserName: String,
    Score: Number
};

var quizQuestion = {
    Question: String,
    A: String,
    B: String,
    C: String,
    D: String,
    CorrectAnswer: String
};

var quiz = {
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




//End Private functions


module.exports = {

    //TODO:CE Populate quiz group page
    quizGroupForm: function (req, res) {

        var noData = { GroupName: "", Password: ""} //no groupname or password when loading
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

    //Bespoke functions 
    insertUserToQuizGroup: function (req, res) {
        var quizGroup = req.body;

        quizGroupModel.insertUserToQuizGroup(quizGroup, function (returnedQuizGroupUser) {

            console.log(returnedQuizGroupUser)

        });
    },

    loginQuizGroup: function (req, res) {

        var localUser = userController.findUser

        var quizGroup = req.body;

        console.log(quizGroup);

        var query = {_id: quizGroup}

        quizGroupModel.FindQuizGroup(query, function (returningData) {

            let data = { quiz: returningData, login: returningData };

            console.log(data)

            res.render("pages/JoinQuiz", data);
            console.log("Login box being populated");
        })

    },

    dashboardQuizGroup: function (req, res) {
        var quizGroup = req.body;

        console.log(quizGroup);

        var query = { _id: quizGroup }

        quizGroupModel.FindQuizGroup(query, function (returningData) {

            let data = { quizGroup: returningData};

            console.log(data)

            res.render("pages/QuizDashboard", data);
            console.log("Login Successful");
        })

    },
    
    //exporting properties and access methods

    convertQuizGroupToLocal: function (returnedQuizGroup) {

        for (let i in returnedQuizGroup) {
            if (returnedQuizGroup[i]._id != null) { quizGroup._id = returnedQuizGroup[i]._id}
            if (returnedQuizGroup[i].GroupName != null) { quizGroup.GroupName = returnedQuizGroup[i].GroupName}
            if (returnedQuizGroup[i].Password != null) { quizGroup.Password = returnedQuizGroup[i].Password }
            if (returnedQuizGroup[i].GroupMembers != null) { quizGroup.GroupMembers = returnedQuizGroup[i].GroupMembers }
        }
        return quizGroup

    },

    quizGroup,

    convertQuizGroupUserToLocal: function (returnedQuizGroupUser) {

        for (let i in returnedQuizGroupUser) {
            if (returnedQuizGroupUser[i]._id != null) { quizGroupUser._id = returnedQuizGroupUser[i]._id }
            if (returnedQuizGroupUser[i].FullName != null) { quizGroupUser.FullName = returnedQuizGroupUser[i].FullName }
            if (returnedQuizGroupUser[i].UserName != null) { quizGroupUser.UserName = returnedQuizGroupUser[i].UserName }
        }
        return quizGroupUser

    },

    quizGroupUser,
    

}