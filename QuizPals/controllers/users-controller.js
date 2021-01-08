var userModel = require('../models/users-model');

//Private functions



//End Private functions


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

    signInNavigation: function (req, res) {

        var username = req.body.username;
        var password = req.body.password;

        var user = {
            UserName: username,
            Password: password
        }

        userModel.CheckUserExists(user, function (userCount) {
            console.log(userCount)
            //the username and password matched a username and password in the database
            if (userCount == 1) {

                userModel.FindUser(user, function (returnedUser) {

                    console.log("Navigated to the dashboard page");
                    res.render('pages/dashboard', user);

                })

            //the username and password did not match in the database
            } else {
                var message = "Login failed"
                res.render('pages/login')
                console.log(message)
            }
        }) 
    },

    findUser: function (req, res) {

        //console.log("Navigated to the dashboard page");
        //res.render('/pages/dashboard');
    },

    createUser: function (req, res) {

        var fullname = req.body.fullname;
        var username = req.body.username;
        var confirmPassword = req.body.confirmPassword;
        var password = req.body.password;


        const user = {
            FullName: fullname,
            UserName: username,
            Password: password
        }

        //console.log(user)

        if (password == confirmPassword) {

            userModel.CheckUserExists({ UserName: username }, function (usercount) {
                console.log(usercount)
                if (usercount > 0) {
                    var message = "Username is already in use";
                    var userinfo = { Fullname: fullname };
                    let pageData = { user: userinfo, message: message };
                    console.log(message)
                    res.render("pages/signup", pageData)
                } else {

                    userModel.createUser(user, function (returningData) {
                        var message = "New User: " + returningData.UserName + " saved to database";
                        let pageData = { user: returningData, message: message };

                        res.render("pages/signup", pageData)
                        console.log("New User Added");
                    });

                }
           
            });
        } else {

            var message = "Passwords did not match please try again";
            console.log(message)
            let pageData = { user: user, message: message };
            res.render("pages/signup", pageData)
        }
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

    }

}