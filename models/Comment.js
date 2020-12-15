const mongoose = require('mongoose');

const commnet_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body: String,
    posted_by: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'User',
    },
    time_posted: Date,
});

module.exports = mongoose.model('Comment', commnet_schema);