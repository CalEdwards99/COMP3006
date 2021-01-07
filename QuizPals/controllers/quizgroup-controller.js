var quizGroupModel = require('../models/quizgroup-model');

//Private functions



//End Private functions


module.exports = {

    //TODO:CE Populate quiz group page
    quizGroupForm: function (req, res) {
        res.render('pages/quizGroup');
    },
    createQuizGroup: function (req, res) {

        var quizGroup = req.body;

        quizGroupModel.createQuizGroup(quizGroup, function (returningData) {

            var message = "Quiz Group: " + returningData.GroupName + " saved to database";
            let pageData = { quiz: returningData, message: message };

            res.render("pages/CreateQuiz", pageData)
            console.log("New QuizGroup Added");
        });
    },

    listAllQuizGroup: function (req, res) {

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
        //const editId = req.params.id;
        //const editData = quizGroupModel.insertUserToQuizGroup(editId);
        //res.render('/pages/QuizDashboard', { editData: editData, editId: editId });
        //res.render('/pages/QuizDashboard', { editData: editData, editId: editId });
    },

    loginQuizGroup: function (req, res) {

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

    //Bespoke functions 
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

        //res.render('/pages/QuizDashboard', { editData: editData, editId: editId });
    },
    

    

}