
var express = require('express');
const userController = require('../controllers/users-controller');
const passport = require("passport");
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth') 

//navigates to the landing page
router.get('/signup', userController.signUpNavigation);

// sign in route
router.get('/login', ensureAuthenticated, userController.UserDashboard);



// creates a user route
router.post('/create', userController.createUser);

////display the quiz dashboard
//router.post('/dashboard', quizgroupController.dashboardQuizGroup);

//// display data route
//router.get('/joinquizgroup', quizGroupController.listAllQuizGroup);

//Login mechanism, authorises passport
router.post('/login', (req, res, next) => {
    console.log("Authenticating with passport")
    passport.authenticate('local', {
        session: true,
        successRedirect: '/user/login',
        failureRedirect: '/',
        failureFlash: true,
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Now logged out');
    res.redirect('/');
});


module.exports = router;