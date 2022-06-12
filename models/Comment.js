const { Schema, Types } = require('mongoose');
const moment = require('moment');

const commentSchema = new Schema(
    {
        commentId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        commentBody: {
            type: String,
            required: [true, 'Please leave a comment on this thought'],
            trim: true,
            minlength: 1,
            maxlength: 280
        },
        username: {
            type: String,
            required: [true, 'Please enter your username']
        },
        createdAt: {
            type: String,
            default: moment(new Date()).format('DD MMM YYYY [at] hh:mm a')
        },
    },
    {
        toJSON: {
            getter: true,
        },
        id: false,
    }
)


module.exports = commentSchema;