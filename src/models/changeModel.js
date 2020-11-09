const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const changeSchema = new Schema(
    {
        location: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        comment: {
            type: String,
            trim: true,
            lowercase: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'article'
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
      }
)

const Change = mongoose.model('change', changeSchema)

module.exports = Change;
