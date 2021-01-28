var quizGroupModel = require('../models/quiz-model');

var quizGroupController = require('../controllers/quizgroup-controller');

//public properties, done indivdually on each page to avoid circular dependancies

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
    //_id: ObjectId,
    QuizTitle: String,
    QuizCreator: String,
    Questions: [quizQuestion],
    UserScores: [quizScore]
};


module.exports = {

    //TODO:CE Populate quiz group page
    NavCreateQuiz: function (req, res) {
        console.log("navigating to quiz create page")
        res.render('pages/createquiz');
    },

    //createQuiz: function (req, res) {

    //    var quizGroup = req.body;

    //    quizGroupModel.createQuizGroup(quizGroup, function (returningData) {

    //        var message = "Quiz: " + returningData.GroupName + " saved to database";
    //        let pageData = { quiz: returningData, message: message };

    //        res.render("pages/CreateQuiz", pageData)
    //        console.log("New QuizGroup Added");
    //    });
    //},


    //Bespoke functions 
    addQuizToQuizGroup: function (quizName, returnedQuizGroupQuiz) {

        quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
            var localQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)
        })

    },


    getQuizFromQuizGroup: function (quizName ,returnedQuizGroupQuiz) {

        for (let i in returnedQuizGroupQuiz) {
            //console.log("quiz group ID: " + returnedQuizGroupQuiz[i]._id)
            if (returnedQuizGroupQuiz[i].QuizTitle == quizName) {

            
            if (returnedQuizGroupQuiz[i]._id != null) { quiz._id = returnedQuizGroupQuiz[i]._id }
            if (returnedQuizGroupQuiz[i].QuizCreator != null) { quiz.QuizCreator = returnedQuizGroupQuiz[i].QuizCreator }
            if (returnedQuizGroupQuiz[i].QuizTitle != null) { quiz.QuizTitle = returnedQuizGroupQuiz[i].QuizTitle }
            if (returnedQuizGroupQuiz[i].Questions != null) { quiz.Questions = returnedQuizGroupQuiz[i].Questions }
            if (returnedQuizGroupQuiz[i].UserScores != null) { quiz.UserScores = returnedQuizGroupQuiz[i].UserScores }

            }
        }

        return quiz

    },

    quiz

    //insertUserToQuizGroup: function (req, res) {
       
    //},


}