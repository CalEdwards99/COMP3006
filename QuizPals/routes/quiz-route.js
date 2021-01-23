var express = require('express');
var quizController = require('../controllers/quiz-controller');
var router = express.Router();

//router.post('/login', quizController.loginQuizGroup);

//navigate to the create quiz section
router.post('/form', quizController.NavCreateQuiz);

//creates a new quiz
//router.post('/create', quizController.createQuiz)

module.exports = router;