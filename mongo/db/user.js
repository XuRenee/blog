var mongoose = require('./connection')
var user = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    confirm:String,
    headerurl:String
});

var User = mongoose.model('user', user)


module.exports = User;