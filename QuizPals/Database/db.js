let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({ name: String, User: String });
let user = mongoose.model("User", userSchema);

async function listAllUsers() {
    let users = await user.find({});
    return users;
}

module.exports.listAllUsers = listAllUsers;