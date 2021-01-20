var quizGroupModel = require('../models/quiz-model');


module.exports = {

    //TODO:CE Populate quiz group page
    NavCreateQuiz: function (req, res) {
        console.log("navigating to quiz create page")
        res.render('pages/createquiz');
    },

    createQuiz: function (req, res) {

        var quizGroup = req.body;

        quizGroupModel.createQuizGroup(quizGroup, function (returningData) {

            var message = "Quiz: " + returningData.GroupName + " saved to database";
            let pageData = { quiz: returningData, message: message };

            res.render("pages/CreateQuiz", pageData)
            console.log("New QuizGroup Added");
        });
    },


    //Bespoke functions 
    insertUserToQuizGroup: function (req, res) {
       
    },


}