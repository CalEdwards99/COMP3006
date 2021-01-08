
var express = require('express');
const userController = require('../controllers/users-controller');
var router = express.Router();

//navigates to the landing page
router.get('/signup', userController.signUpNavigation);

// sign in route
router.post('/login', userController.signInNavigation);

// creates a user route
router.post('/create', userController.createUser);

////display the quiz dashboard
//router.post('/dashboard', quizgroupController.dashboardQuizGroup);

//// display data route
//router.get('/joinquizgroup', quizGroupController.listAllQuizGroup);

////router.post('/login:id', quizGroupController.loginQuizGroup);
//router.post('/login', quizGroupController.loginQuizGroup);

module.exports = router;