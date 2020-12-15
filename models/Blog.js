const mongoose = require('mongoose');

const blog_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    posted_by: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    time_posted: Date,
    comments: [{
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Comment',
    }]
});

module.exports = mongoose.model('Blog', blog_schema);