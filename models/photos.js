const mongoose = require("mongoose")
const { Schema } = mongoose;
const { createSlugWithDate } = require('../funcs/friendlyUrl')
//const moment = require('moment')

const photosSchema = new Schema({
    title: String,
    slug: { type: String, unique: true },
    description: String,
    image: {
        name: String,
        url: String,
        secure_url: String,
        public_id: String
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", default: '5b20b80c7b63f32838605b50' },
    tags: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    created_on: { type: Date, default: Date.now },
    status: {
        named: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
        submitted: { type: Boolean, default: false }, 
        featured: { type: Boolean, default: false }
    },
    likes: { type: Number, default: 0 }
})

photosSchema.index({ title: 'text', description: 'text', tags: 'text' },{ sparse: true })

photosSchema.pre('save', function (next) {
    this.slug = createSlugWithDate(this.title)
    next()
})

photosSchema.pre('save', function (next) {
    const category = mongoose.model('category');
    return category.findById(this.category)
        .then(Cat => {
            ++Cat.count.photos;
            Cat.save()
        })
    next()
})

// photosSchema.pre('save', function (next) {
//     const User = mongoose.model('user')
//     return User.findById(this.user)
//         .then(found => {
//             ++found.content.imageCount
//             found.save()
//         })
//     next()
// })


mongoose.model("photo", photosSchema);