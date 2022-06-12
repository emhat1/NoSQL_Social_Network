const { Schema, model, Types } = require('mongoose');
const commentSchema = require('./Comment');
const moment = require('moment');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: [true, 'What are your thoughts?'],
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: String,
            default: moment(new Date()).format('DD MMM YYYY [at] hh:mm a'),
        },
        username: {
            type: String,
            required: [true, 'Please enter your username'],
        },
        comments: [commentSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getter: true,
        },
        id: false,
    }
);


thoughtSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});


const Thought = model('Thought', thoughtSchema);

module.exports = Thought;