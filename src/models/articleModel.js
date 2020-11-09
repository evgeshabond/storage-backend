const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const articleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        barcode: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
      }
)

articleSchema.virtual('changes', {
    ref: 'change',
    localField: '_id',
    foreignField: 'article'
})

const Article = mongoose.model('article', articleSchema)

module.exports = Article;

