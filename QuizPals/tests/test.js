var expect = require("chai").expect;
const fetch = require("node-fetch");
//const app = require('../app');

//config files
var config = require("../config/config");

//helper files
var passwordHelper = require("../helper/password");

//models
const usersModel = require("../models/users-model");
const quizgroupModel = require("../models/quizgroup-model");
const quizModel = require("../models/quiz-model");
const quizquestionModel = require("../models/quizquestion-model");

//controllers
const usersController = require("../controllers/users-controller");
const quizgroupController = require("../controllers/quizgroup-controller");
const quizController = require("../controllers/quiz-controller");
const quizquestionController = require("../controllers/quizquestion-controller");




var db = config.db;

//format for test case
describe("ClassName", function () {
    describe("MethodName", function () {
        it("Description of the case we are testing", function () {
            expect(true).equal(true);
        });
    });
});

//------------------------------ DATABASE TESTS ------------------------------//

describe("Database", function () {
    describe("Database Connection", function () {
        it("Testing database connection", function () {

            db.on('error', function () {
                expect(true).equal(false);
            });
            db.once('open', function () {
                expect(true).equal(true);
            });
        });
    });
});

//------------------------------ USER TESTS ------------------------------//

describe("Users", function () {
    describe("Testing all user related functions", function () {
        this.timeout(30000)
        var newUser = {
            FullName: "Test Person",
            UserName: "TestAccount",
            Password: "Test123"
        }

        it("Testing that a copy of test User isn't it the database ", (done) => {
            this.timeout(15000)

            usersModel.CheckUserExists({ UserName: newUser.UserName }, function (usercount) {
                console.log("User count should be 0, returned: " + usercount)
                expect(usercount).equal(0)
                done();
            });

        });


        it("Creating a new  test user ", (done) => {
            this.timeout(15000)

            usersModel.createUser(newUser, function (returningData) {
                usersModel.CheckUserExists({ UserName: returningData.UserName }, function (usercount) {
                    console.log("User count should be 1, returned: " + usercount)
                    expect(usercount).equal(1)
                    done();
                });

            });
        });

        it("Updating test user ", (done) => {

            usersModel.FindUser(newUser, function (returningData) {

                var localUser = usersController.convertReturnedUserToLocal(returningData)
                localUser.FullName = "resU tseT"

                usersModel.updateUser(localUser._id, localUser, function (updatedUser) {

                    usersModel.FindUser(updatedUser, function (returnedUpdatedUser) {
                        var returnedUser = usersController.convertReturnedUserToLocal(returnedUpdatedUser)
                        expect(returnedUser.FullName).equal(localUser.FullName)
                        done();
                    });  
                });         

            });

        });

        it("Deleting test user ", (done) => {

            var query = {UserName: newUser.UserName }

            usersModel.FindUser(query, function (returningData) {
                var localUser = usersController.convertReturnedUserToLocal(returningData);

                var userID = localUser._id;

                usersModel.deleteUser(userID, function (callback) {

                    usersModel.CheckUserExists(query, function (usercount) {
                        console.log("User should have been deleted from the database");
                        expect(usercount).equal(0);
                        done();
                    });
                })
            });

            
        });

    });

});

//------------------------------ QUIZ GROUP TESTS ------------------------------//


//------------------------------ HELPER TESTS ------------------------------//

describe("Helpers", function () {
    describe("Password", function () {
        it("Generating a password", (done) => {
            var plainTextpassword = "TestPassword"

            passwordHelper.generatePassword(plainTextpassword, function (returnedPassword) {

                console.log("Password generated :" + returnedPassword)

                if (plainTextpassword != returnedPassword) {
                    expect(true).equal(true);
                    done();
                } else {
                    expect(true).equal(false);
                    done;
                }
            }) 

        });

        it("Testing password comparison function", (done) => {
            var plainTextpassword = "TestPassword"
            var encryptedPassword = "$2b$10$C/We981MFwDe1hwrC9ta9eoHhEnWxE4EtpfpGA9rTzHKr11ylX826" //encrypted plaintext

            passwordHelper.comparePasswords(plainTextpassword, encryptedPassword, function (result) {
                expect(result).equal(true);
                done();
            })

        });

    });
});








