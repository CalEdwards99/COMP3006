const LocalStrategy = require('passport-local').Strategy;
const UserModel = require("../models/users-model");
const UserController = require("../controllers/users-controller")
var passwordHelper = require("../helper/password");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'UserName' }, (username, password, done) => {
            //match user
            UserModel.FindUser({ UserName: username }, function (returnedUser) {
                //var user = UserModel.userTable

                var localUser = UserController.convertReturnedUserToLocal(returnedUser)

                //new user = returnedUser
                for (let i in returnedUser) {
                    var userPassword = returnedUser[i].password;
                }
                

                if (!returnedUser) {
                    return done(null, false, { message: 'No account for this username' });
                }

                
                //passwordHelper.comparePasswords(password, userPassword)
                passwordHelper.comparePasswords(password, localUser.Password, function (result) {
                    if (result = true) {
                        return done(null, returnedUser);
                    }

                    if (result = false) {
                        return done(null, false, { message: 'Password is incorrect' });
                    }

                })

                //match the password
                //bcrypt.compare(password, userPassword, (err, isMatch) => {
                //    if (err) throw err;

                //    if (isMatch) {
                //        return done(null, returnedUser);
                //    } else {
                //        return done(null, false, { message: 'Password is incorrect' });
                //    }

                //})

            });

        })

    )
    passport.serializeUser(function (user, done) {
        console.log("serializing user")
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserializing user")

        UserModel.FindUser({ _id: id }, function (err, user) {
            done(err, user);
        });
    });
}; 

