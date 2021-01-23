var userModel = require('../models/users-model');
var passport = require('../config/passport');
var passwordHelper = require('../helper/password')

//public controller properties
const localUser = {
    _id: String,
    FullName: String,
    UserName: String,
    Password: String
}


function convertReturnedUserToLocal (returnedUser) {

    for (let i in returnedUser) {
        if (returnedUser[i]._id != null) { localUser._id = returnedUser[i]._id }
        if (returnedUser[i].FullName != null) { localUser.FullName = returnedUser[i].FullName }
        if (returnedUser[i].UserName != null) { localUser.UserName = returnedUser[i].UserName }
        if (returnedUser[i].Password != null) { localUser.Password = returnedUser[i].Password }
    }
    return localUser

}

module.exports = {

    signUpNavigation: function (req, res) {
        console.log("Navigated to the user sign-up page");

        //let messageinfo = { Message: "" }
        let userinfo = { FullName: "", UserName: "" };

        let pageData = { user: userinfo, message: "" }
        //let data = user;
        console.log(pageData);

        res.render('pages/signup', pageData);
    },

    UserDashboard: function (req, res) {
        console.log("Navigated to the User dashboard page");
        res.render('pages/dashboard');
    },

    signInNavigation: function (req, res, next) {

        console.log(req)

        let errors = [];

        var username = req.body.UserName;
        var password = req.body.password;

        if (!username || !password) {
            errors.push({ msg: "Please fill all fields" })
        }

        var user = {
            UserName: username,
            Password: password
        }

        

        userModel.CheckUserExists(user, function (userCount) {
            if (userCount !== 1) {
                errors.push({ msg: "User not found / password incorrect" })
            }
        }) 

        if (errors.length > 0) {
            res.render('pages/login', {
                errors: errors,
                user: user
            })
        } else { // no errors so navigate to the dashboard

            var query = {UserName: user.UserName }

            userModel.FindUser(query, function (returnedUser) {

                var localUser = convertReturnedUserToLocal(returnedUser)

                console.log(localUser)

                console.log("Navigated to the dashboard page");
                res.render('pages/dashboard',
                    { localUser: localUser}
                );
            })

        }
    },

    findUser: function (req, res) {

    },

    createUser: function (req, res) {
        let errors = [];

        var fullname = req.body.fullname;
        var username = req.body.username;
        var confirmPassword = req.body.confirmPassword;
        var password = req.body.password;

            if (!fullname || !username || !password || !confirmPassword ) {
                errors.push({ msg: "Please fill all fields" })
            }

            const user = {
                FullName: fullname,
                UserName: username,
                Password: password
            }

            if (password !== confirmPassword) {
                errors.push({ msg: "Please ensure passwords match" });
            }

            userModel.CheckUserExists({ UserName: username }, function (usercount) {
                if (usercount > 0) {
                    errors.push({ msg: "Username is already in use" });
                }
            });


            if (errors.length > 0) {
                res.render('pages/signup', {
                    errors: errors,
                    user: user
                })
            } else { // no errors so create a new user

                passwordHelper.generatePassword(user.Password, function (returnedPassword) {
                    user.Password = returnedPassword

                    //save user
                    userModel.createUser(user, function (returningData) {
                        errors.push({ msg: "New User: " + returningData.UserName + " saved to database" });
                        req.flash('success_msg', 'You have now registered!')
                        let pageData = { user: returningData, errors: errors };
                        res.render("pages/signup", pageData)
                        console.log("New User Added");
                    });

                })
                
            } //ELSE statement ends here
    },

    editUser: function (req, res) {
        const editId = req.params.id;
        const editData = quizGroupModel.updateQuizGroup(editId);
        res.render('/pages/quizgroup', { editData: editData, editId: editId });
    },

    deleteUser: function (req, res) {
        const deleteId = req.params.id;
        const deleteData = quizGroupModel.deleteQuizGroup(deleteId);
        res.send('<h1>' + deleteData + '</h1>');
    },

    //Bespoke functions 
    insertUserToQuizGroup: function (req, res) {

    },

    convertReturnedUserToLocal,

    //exporting properties and access methods

    //convertReturnedUserToLocal: function (returnedUser) {

    //    for (let i in returnedUser) {
    //        if (returnedUser[i]._id != null) { localUser._id = returnedUser[i]._id }
    //        if (returnedUser[i].FullName != null) { localUser.FullName = returnedUser[i].FullName }
    //        if (returnedUser[i].UserName != null) { localUser.UserName = returnedUser[i].UserName }
    //        if (returnedUser[i].Password != null) { localUser.Password = returnedUser[i].Password }
    //    }
    //    return localUser

    //},

    localUser

}