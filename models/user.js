var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});


var passportLocalMongoose = require('passport-local-mongoose');
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
