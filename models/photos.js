const mongoose = require("mongoose")
const { Schema } = mongoose;
const { createSlugWithDate } = require('../funcs/friendlyUrl')

const photosSchema = new Schema({
    title: String,
    slug: { type: String, unique: true },
    shortDesc: String,
    description: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    created_on: { type: Date, default: Date.now }
})

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


mongoose.model("photo", photosSchema);