const bcrypt = require('bcrypt');

module.exports = {

    generatePassword: function (plainTextPassword, returnedPassword) {
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(plainTextPassword, salt,
                (err, hash) => {
                    if (err) throw err;
                    //return the hashedPassword
                     return returnedPassword(hash);
                }));

    },

    comparePasswords: function (plainTextPassword, encryptedPassword, result) {

        //match the password
        bcrypt.compare(plainTextPassword, encryptedPassword, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                console.log("Password was correct")
                return result(true)
            } else {
                console.log("Password was incorrect")
                return result(false)
            }
        })

    }

}

