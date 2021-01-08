const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require("../models/users-model");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'UserName' }, (username, password, done) => {
            //match user
            UserModel.FindUser({ UserName: username }, function (returnedUser) {
                if (!returnedUser) {
                    return done(null, false, { message: 'No account for this username' });
                }

                //match the password
                bcrypt.compare(password, user.passport, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password is incorrect' });
                    }

                })

            });


            //User.findOne({ email: email })
            //    .then((user) => {
            //        if (!user) {
            //            return done(null, false, { message: 'that email is not registered' });
            //        }
            //        //match pass
            //        bcrypt.compare(password, user.password, (err, isMatch) => {
            //            if (err) throw err;

            //            if (isMatch) {
            //                return done(null, user);
            //            } else {
            //                return done(null, false, { message: 'pass incorrect' });
            //            }
            //        })
            //    })
            //    .catch((err) => { console.log(err) })
        })

    )
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.FindUser(id, function (err, user) {
            done(err, user);
        });
    });
}; 

