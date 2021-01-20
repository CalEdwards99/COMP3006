var quizQuestionModel = require('../models/quizquestion-model');


module.exports = {

    //TODO:CE Populate quiz group page
    navCreateQuizQuestion: function (req, res) {
        res.render('pages/quizquestion');
    },

    createQuizQuestion: function (req, res) {
        let errors = [];

        var quizQuestion = req.body;
        console.log(quizQuestion);

        var questionTitle = req.body.questionTitle
        var answer1 = req.body.answer1
        var answer2 = req.body.answer2
        var answer3 = req.body.answer3
        var answer4 = req.body.answer4
        var CorrectAnswer = req.body.CorrectAnswer

        if (!questionTitle || !answer1 || !answer2 || !answer3 || !answer4 || !CorrectAnswer) {
            errors.push({msg: "Please ensure all fields are filled out" })
        }



        //quizQuestionModel.createQuizQuestion(quizGroup, function (returningData) {

        //    var message = "Question: " + returningData.GroupName + " saved to database";
        //    let pageData = { quiz: returningData, message: message };

        //    res.render("pages/CreateQuiz", pageData)
        //    console.log("New QuizGroup Added");
        //});

        res.render('pages/CreateQuiz');
        console.log("Added a Question to the Quiz")
    },


    //Bespoke functions 
    insertUserToQuizGroup: function (req, res) {
    },


}