const express = require('express');
const passport = require("passport");
//const userController = require('../controllers/users-controller');
const router = express.Router();

//register page
//router.post('/login', (req, res, next) => {
//    passport.authenticate('local', {
//        successRedirect: '/dashboard',
//        failureRedirect: '/users/login',
//        failureFlash: true,
//    })(req, res, next);
//})

router.post('/default', (req, res) => {
    res.redirect('/');
});

//{
    //console.log("login through index")
    //res.render('pages/dashboard');
//})

//Login mechanism, authorises passport
//router.post('/login', passport.authenticate('local', {
//    failureRedirect: '/login',
//    failureFlash: true
//}),
//    function (req, res) {
//        req.flash('success_message', 'You are now Logged in!!');
//        res.redirect('/');
//    }
//);

module.exports = router; 