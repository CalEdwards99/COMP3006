var quizGroupModel = require('../models/quiz-model');

//Private functions



//End Private functions


module.exports = {

    //TODO:CE Populate quiz group page
    NavCreateQuiz: function (req, res) {
        res.render('pages/quiz');
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


    //Bespoke functions 
    insertUserToQuizGroup: function (req, res) {
        //const editId = req.params.id;
        //const editData = quizGroupModel.insertUserToQuizGroup(editId);
        //res.render('/pages/QuizDashboard', { editData: editData, editId: editId });
        //res.render('/pages/QuizDashboard', { editData: editData, editId: editId });
    },


}