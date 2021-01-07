
var express = require('express');
const quizgroupController = require('../controllers/quizgroup-controller');
var quizGroupController = require('../controllers/quizgroup-controller');
var router = express.Router();

// curd form route
router.get('/form', quizGroupController.quizGroupForm);
// create data route
router.post('/create', quizGroupController.createQuizGroup);
// display data route
//router.get('/fetch', quizGroupController.readQuizGroup);
//// edit data route
//router.get('/edit/:id', quizGroupController.editQuizGroup);
//// delete data route
//router.get('/delete/:id', quizGroupController.deleteQuizGroup);

//display the quiz dashboard
router.post('/dashboard', quizgroupController.dashboardQuizGroup);


// display data route
router.get('/joinquizgroup', quizGroupController.listAllQuizGroup);

//router.post('/login:id', quizGroupController.loginQuizGroup);
router.post('/login', quizGroupController.loginQuizGroup);

module.exports = router;