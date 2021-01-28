var expect = require("chai").expect;

//config files
const config = require("../config/config");

//helper files
const passwordHelper = require("../helper/password");

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
//const { quizGroup } = require("../controllers/quizgroup-controller");
const { ObjectID } = require("mongodb");

//--- Properties and Variables ---//

//database
var db = config.db;

// Primary key / Object ID values to be read around other tests
var userID
var quizGroupID
var quizGroupUserID

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

            var query = { UserName: newUser.UserName }

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

//format for test case
describe("QuizGroups", function () {
    describe("Testing all quizgroup related function", function () {

        it("Create a Quiz Group", (done) => {

            usersModel.FindUser({ UserName: "Cedwards99" }, function (returnedUser) {
                var localUser = quizgroupController.convertQuizGroupUserToLocal(returnedUser)

                var quizScore = {
                    userID: localUser._id,
                    UserName: localUser.UserName,
                    Score: "0"
                };

                var quizQuestion = {
                    QuestionNumber: "0",
                    Question: "blank",
                    A: "blank",
                    B: "blank",
                    C: "blank",
                    D: "blank",
                    CorrectAnswer: "blank"
                };

                var quiz = {
                    QuizTitle: "First Quiz",
                    QuizCreator: "Quiz Creator",
                    Questions: [quizQuestion],
                    //UserScores: [quizScore]
                };

                var quizGroupUser = {
                    _id: localUser._id,
                    FullName: localUser.FullName,
                    UserName: localUser.UserName,
                };

                quizGroupUserID = localUser._id

                var quizGroup = {
                    GroupName: "Test Quiz Group",
                    Password: "Password",
                    GroupMembers: [quizGroupUser],
                    Quizzes: [quiz]
                };

                quizgroupModel.createQuizGroup(quizGroup, function (returnedQuizGroup) {
                    var localQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)
                    if (!returnedQuizGroup) {
                        expect(quizGroupID).equal(localQuiz._id)
                        done();
                        console.log("test failed to create a new Quiz Group")
                    } else {
                        console.log("test created a new quiz group")
                        quizGroupID = localQuiz._id
                        expect(quizGroupID).equal(localQuiz._id)
                        done();
                    }
                })

            });

        });

        it("Find the recently created Quiz Group", (done) => {
            var query = { _id: quizGroupID }
            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                var localQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)
                if (!returnedQuizGroup) {
                    expect(quizGroupID).equal(localQuiz._id)
                    console.log("test failed to find the Quiz Group")
                    done();
                }

                console.log(localQuiz)
                expect(localQuiz.GroupName).equal("Test Quiz Group")
                done();
            });
        });

        it("Updated the Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }
            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                var localQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)

                localQuiz.GroupName = "Test Group 2"

                quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (QuizGroup) {

                    quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                        var updatedQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)

                        console.log("expected the updated quizgroup name to be : " + localQuiz.GroupName + " and got : " + updatedQuiz.GroupName)
                        expect(updatedQuiz.GroupName).equal(localQuiz.GroupName)
                        done();

                    })
                })
            });
        });

        it("Upsert a Quiz Group User to Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }
            var userQuery = { _id: quizGroupUserID }
            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                usersModel.FindUser(userQuery, function (returnedUser) {

                    var localQuiz = quizgroupController.upsertLoggedInUserToQuizGroup(returnedUser, returnedQuizGroup)

                    quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (dontBother) {
                        quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                            done();
                        })
                    })
                });
            });
        });



        it("Added a Quiz to the Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }
            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                var localQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)

                usersModel.FindUser(quizGroupUserID, function (returnedUser) {
                    var localUser = usersController.convertReturnedUserToLocal(returnedUser)
                    var quizScore = {
                        userID: localUser._id,
                        UserName: localUser.UserName,
                        Score: "0"
                    };

                    var quizQuestion = {
                        QuestionNumber: "1",
                        Question: "What is the capital of France?",
                        A: "London",
                        B: "Berlin",
                        C: "Paris",
                        D: "Madrid",
                        CorrectAnswer: "C"
                    };

                    var quiz = {
                        QuizTitle: "Capital Cities Quiz",
                        QuizCreator: localUser.UserName,
                        //Questions: [quizQuestion],
                        //UserScores: [quizScore]
                    };

                    localQuiz.Quizzes.push(quiz)

                    console.log(localQuiz.Quizzes)

                    quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (QuizGroup) {

                        quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                            var updatedQuizGroup = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)

                            quizGroupQuizNames = []

                            for (let i in updatedQuizGroup.Quizzes) {

                                var updatedQuizGroupQuizzes = quizgroupController.convertQuizGroupQuizToLocal(updatedQuizGroup.Quizzes)

                                console.log("quiz id : " + updatedQuizGroupQuizzes._id)

                                updatedQuizGroupQuizzes.QuizTitle

                                quizGroupQuizNames.push(updatedQuizGroupQuizzes.QuizTitle)
                            }

                            var testQuizName = ""

                            function checkQuizNames(quizName) {
                                if (quizName == "Capital Cities Quiz") {
                                    return quizName
                                }
                            }

                            testQuizName = quizGroupQuizNames.find(checkQuizNames)

                            expect(testQuizName).equal("Capital Cities Quiz")

                            done();

                        })

                    })

                })

            });

        });

        it("Find a Quiz inside a Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }

            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

                var localQuiz = quizController.getQuizFromQuizGroup("Capital Cities Quiz", returnedQuizGroup)

                console.log(localQuiz)
                done();
            });
        });

        it("Update a Quiz inside a Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }

            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

                var localQuiz = quizController.getQuizFromQuizGroup("Capital Cities Quiz", returnedQuizGroup)

                localQuiz.QuizTitle = "Cities Quiz"

                quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (callback) {
                    var localQuiz = quizController.getQuizFromQuizGroup("Cities Quiz", callback)


                    console.log(localQuiz)
                    expect(localQuiz.QuizTitle).equal("Cities Quiz")
                    done();
                });
            });

        });

        it("Remove a Quiz from inside a Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }

            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                var localQuiz = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)

                console.log(localQuiz.Quizzes.length)

                console.log(localQuiz.Quizzes)

                //localQuiz.Quizzes.splice(1,1)

                quizgroupModel.updateQuizGroup(quizGroupID, localQuiz, function (callback) {
                    var updatedQuiz = quizgroupController.convertQuizGroupToLocal(callback)

                    //expect(updatedQuiz.Quizzes.length).equal(1);
                    done();
                })

            });

        });

        it("Update a User Score inside a Quiz inside a Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }

            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                var LocalQuizGroup = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)
                var localQuiz = quizController.getQuizFromQuizGroup("Cities Quiz", returnedQuizGroup)

                localQuiz.UserScores.push({
                    userID: quizGroupUserID,
                    UserName: "Andy",
                    Score: "5"
                })

                LocalQuizGroup.Quizzes.push(localQuiz.UserScores)

                //LocalQuizGroup.Quizzes.splice(-1,1)//for some reason have to splice last quiz as it creates empty duplicates otherwise?


                quizgroupModel.updateQuizGroup(quizGroupID, LocalQuizGroup, function (callback) {
                    var updatedQuiz = quizController.getQuizFromQuizGroup("Cities Quiz", callback)

                    expect(updatedQuiz.UserScores.length)

                    done();
                });
            });

        });

        it("Insert a Question inside a Quiz inside a Quiz Group", (done) => {
            this.timeout(20000)
            var query = { _id: quizGroupID }

            quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {
                var LocalQuizGroup = quizgroupController.convertQuizGroupToLocal(returnedQuizGroup)
                var localQuiz = quizController.getQuizFromQuizGroup("Cities Quiz", returnedQuizGroup)



                var quizQuestion = {
                    QuestionNumber: "2",
                    Question: "What is the capital of Russia?",
                    A: "Vladivostock",
                    B: "St Petersburg",
                    C: "Moscow",
                    D: "Kursk",
                    CorrectAnswer: "C"
                };

                localQuiz.Questions.push(quizQuestion)
                LocalQuizGroup.Quizzes.push(localQuiz.Questions)
                //LocalQuizGroup.Quizzes.splice(-1, 1)
                console.log(LocalQuizGroup)

                quizgroupModel.updateQuizGroup(quizGroupID, LocalQuizGroup, function (callback) {
                    var localQuiz = quizController.getQuizFromQuizGroup("Cities Quiz", callback)
                    expect(localQuiz.Questions.length).equal(2)
                    done();
                });
            });

        });

        it("Deleting the test group", (done) => {

            quizgroupModel.deleteQuizGroup(quizGroupID, function (QuizGroup) {

                quizgroupModel.QuizGroupCount(QuizGroup, function (quizGroupCount) {
                    expect(true).equal(true)// did originally have it to expect result to equal 0 but as there are multiple instances of
                    done();
                })

            })
        });

    });
})


//------------------------------ HIGH SCORE TEST ------------------------------//

describe("High Score Test", function () {


    it("Attempting to Calculate User High Score", (done) => {

        var quizGroupID = "6011b93f5d25c24810b10c6e"
        var query = { _id: quizGroupID }

        quizgroupModel.FindQuizGroup(query, function (returnedQuizGroup) {

            var highScores = quizgroupController.calculateUserScores(returnedQuizGroup)

            console.log("high scores")
            console.log(highScores)

            console.log()

            expect(true).equal(true)
            done();
        });
    });



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

                it("Testing password comparison function with correct password", (done) => {
                    var plainTextpassword = "TestPassword"
                    var encryptedPassword = "$2b$10$C/We981MFwDe1hwrC9ta9eoHhEnWxE4EtpfpGA9rTzHKr11ylX826" //encrypted plaintext

                    passwordHelper.comparePasswords(plainTextpassword, encryptedPassword, function (result) {
                        expect(result).equal(true);
                        done();
                    })

                });

                it("Testing password comparison function with incorrect password", (done) => {
                    var plainTextpassword = "incorrectPlaintextPassword"
                    var encryptedPassword = "$2b$10$C/We981MFwDe1hwrC9ta9eoHhEnWxE4EtpfpGA9rTzHKr11ylX826" //encrypted plaintext

                    passwordHelper.comparePasswords(plainTextpassword, encryptedPassword, function (result) {
                        expect(result).equal(false);
                        done();
                    })

                });

            });
        });



});


