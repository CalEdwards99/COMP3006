
var express = require('express');
const userController = require('../controllers/users-controller');
const passport = require("passport");
require("../config/passport")(passport);
var router = express.Router();

//navigates to the landing page
router.get('/signup', userController.signUpNavigation);

// sign in route
//router.post('/login', userController.signInNavigation);

// creates a user route
router.post('/create', userController.createUser);

////display the quiz dashboard
//router.post('/dashboard', quizgroupController.dashboardQuizGroup);

//// display data route
//router.get('/joinquizgroup', quizGroupController.listAllQuizGroup);

////router.post('/login:id', quizGroupController.loginQuizGroup);
//router.post('/login', userController.signInNavigation);

//Login mechanism, authorises passport
//router.post('/login', passport.authenticate('local', {
//    failureRedirect: '/login',
//    failureFlash: true
//}),
//    function (req, res) {
//        //req.flash('success_message', 'You are now Logged in!!');
//        res.redirect('/pages/dashboard');
//    }
//);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
})


module.exports = router;