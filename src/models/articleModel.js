const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const articleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
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
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    { timestamps: true }
)

articleSchema.virtual('changes', {
    ref: 'change',
    localField: '_id',
    foreignField: 'article'
})

const Article = mongoose.model('article', articleSchema)

module.exports = Article;

