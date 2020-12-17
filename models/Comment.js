const mongoose = require('mongoose');

const commnet_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body: String,
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    time_posted: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commnet_schema);