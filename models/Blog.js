const mongoose = require('mongoose');

const blog_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    time_posted: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }]
});

module.exports = mongoose.model('Blog', blog_schema);