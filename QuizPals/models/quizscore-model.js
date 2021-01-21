var mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
    _id: String,
    UserName: String,
    Score: String
});

module.export = {
    quizScoreSchema
}