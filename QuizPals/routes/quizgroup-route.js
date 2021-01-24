
var express = require('express');
const quizgroupController = require('../controllers/quizgroup-controller');
var quizGroupController = require('../controllers/quizgroup-controller');
const { ensureAuthenticated } = require('../config/auth') 
var router = express.Router();

// curd form route
router.get('/navCreateQuizGroup', ensureAuthenticated , quizGroupController.quizGroupForm);
// create data route
router.post('/create', ensureAuthenticated, quizGroupController.createQuizGroup);
// display data route
//router.get('/fetch', quizGroupController.readQuizGroup);
//// edit data route
//router.get('/edit/:id', quizGroupController.editQuizGroup);
//// delete data route
//router.get('/delete/:id', quizGroupController.deleteQuizGroup);

//display the create a quiz page
router.post('/quiz', ensureAuthenticated, quizgroupController.AddQuizForm);
router.post('/addQuiz', ensureAuthenticated, quizgroupController.AddQuiz);

//display the quiz dashboard
router.post('/dashboard', ensureAuthenticated,quizgroupController.dashboardQuizGroup);


// display data route
router.get('/joinquizgroup', ensureAuthenticated,quizGroupController.listAllQuizGroup);

//router.post('/login:id', quizGroupController.loginQuizGroup);
router.post('/login', ensureAuthenticated,quizGroupController.loginQuizGroup);

module.exports = router;