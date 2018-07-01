const mongoose = require("mongoose")
const { Schema } = mongoose
const { createSlugWithDate } = require('../funcs/friendlyUrl')


const collectionSchema = new Schema({
    title: String,
    description: String,
    slug: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    contentCount: { type: Number, default: 0 },
    content: {
        images: [
            { type: mongoose.Schema.Types.ObjectId, ref: "photo" }
        ]
    },
    likes: { type: Number, default: 0 },
    status: { 
        approved: { type: Boolean, default: false },
        submitted: { type: Boolean, default: false }, 
        featured: { type: Boolean, default: false }
    },
    created_on: { type: Date, default: Date.now }
})

collectionSchema.index({ title: 'text', description: 'text', slug: 'text' })

collectionSchema.pre('save', function (next) {
    this.slug = createSlugWithDate(this.title)
    next()
})

mongoose.model("collection", collectionSchema);