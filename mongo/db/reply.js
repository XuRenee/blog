var mongoose = require('./connection')
var release = new mongoose.Schema({
   name:String,
   time:String,
   content:String
});

var reply = mongoose.model('reply', release)


module.exports = reply;