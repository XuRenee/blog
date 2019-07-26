var mongoose = require('./connection')
var release = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    time: Object,
    label: Array,
    content: String,
    reply: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reply'
    }],
    count:{
        type: Number,
        default: 0
    }
});

var release = mongoose.model('release', release)


module.exports = release;