var express = require('express');
var quizQuestionsController = require('../controllers/quizquestion-controller');
var router = express.Router();

//router.post('/login', quizController.loginQuizGroup);

//navigate to the create quiz question page
router.post('/form', quizQuestionsController.navCreateQuizQuestion);

//creates a new question for this quiz
router.post('/create', quizQuestionsController.createQuizQuestion)


module.exports = router;