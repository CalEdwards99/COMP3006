var mongoose = require('mongoose');

// define our user model
// module.exports allows us to pass this to other files when it is called

module.exports.user = mongoose.model('user', {
    name: { type: String, default: '' },
    user: { type: String, default: ''}
});